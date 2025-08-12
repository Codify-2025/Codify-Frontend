import { useCallback, useRef, useState } from 'react';
import axios from 'axios';
import {
  getPresignedUrl,
  uploadToS3,
  registerUpload,
} from '@services/upload.api';
import { toLocalISOStringWithOffset } from '@utils/date';
import type { UploadItemState } from '@typings/upload';

type MetaBase = {
  assignmentId: number;
  week: number;
  submissionDate: Date;
  studentId: number;
  studentName: string;
};

type MetaDeriver = (file: File, index: number) => MetaBase;

type UploadApiError = {
  message?: string;
  code?: string;
};

export function useUploader(concurrency = 3) {
  const [items, setItems] = useState<UploadItemState[]>([]);
  const queueIndexRef = useRef<number>(0);
  const abortControllersRef = useRef<Record<number, AbortController>>({});

  const reset = useCallback(() => {
    // 진행 중 요청 모두 중단
    Object.values(abortControllersRef.current).forEach((ac) => {
      if (ac && !ac.signal.aborted) {
        ac.abort();
      }
    });

    abortControllersRef.current = {};
    queueIndexRef.current = 0;
    setItems([]);
  }, []);

  const enqueue = useCallback((files: File[]) => {
    setItems((prev) => [
      ...prev,
      ...files.map<UploadItemState>((f) => ({
        file: f,
        progress: 0,
        stage: 'idle',
      })),
    ]);
  }, []);

  const cancel = useCallback((i: number) => {
    const ac = abortControllersRef.current[i];
    ac?.abort();
  }, []);

  const runOne = useCallback(
    async (i: number, metaOrDeriver: MetaBase | MetaDeriver) => {
      // 최신 items를 가져오기 위해 함수형 업데이트 사용
      let currentItem: UploadItemState | undefined;
      setItems((prev) => {
        currentItem = prev[i];
        return prev.map((it, idx) =>
          idx === i ? { ...it, stage: 'presigning', error: undefined } : it
        );
      });

      if (!currentItem) {
        console.error(`Item at index ${i} not found`);
        return;
      }

      try {
        const target = currentItem;
        const m: MetaBase =
          typeof metaOrDeriver === 'function'
            ? (metaOrDeriver as MetaDeriver)(target.file, i)
            : (metaOrDeriver as MetaBase);

        const presigned = await getPresignedUrl({
          fileName: target.file.name,
          contentType: target.file.type || 'application/octet-stream',
          assignmentId: m.assignmentId,
          week: m.week,
          studentId: m.studentId,
        });

        const ac = new AbortController();
        abortControllersRef.current[i] = ac;
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? { ...it, stage: 'uploading', s3Key: presigned.s3Key }
              : it
          )
        );

        const { etag } = await uploadToS3(
          target.file,
          presigned,
          (pct) =>
            setItems((prev) =>
              prev.map((it, idx) => (idx === i ? { ...it, progress: pct } : it))
            ),
          ac.signal
        );

        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, stage: 'registering', etag } : it
          )
        );

        await registerUpload({
          assignmentId: m.assignmentId,
          fileName: target.file.name,
          week: m.week,
          submissionDate: toLocalISOStringWithOffset(m.submissionDate),
          studentId: m.studentId,
          studentName: m.studentName,
          s3Key: presigned.s3Key,
          ...(etag ? { etag } : {}),
        });

        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, stage: 'done', progress: 100 } : it
          )
        );
      } catch (err: unknown) {
        const message = axios.isAxiosError<UploadApiError>(err)
          ? (err.response?.data?.message ?? err.message)
          : err instanceof Error
            ? err.message
            : '업로드 중 오류가 발생했습니다.';

        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, stage: 'error', error: message } : it
          )
        );
      } finally {
        delete abortControllersRef.current[i];
      }
    },
    []
  );

  const start = useCallback(
    async (metaOrDeriver: MetaBase | MetaDeriver) => {
      queueIndexRef.current = 0;
      const total = items.length;

      async function worker() {
        while (true) {
          const i = queueIndexRef.current++;
          if (i >= total) break;
          await runOne(i, metaOrDeriver);
        }
      }

      const workers = Array.from({ length: Math.min(concurrency, total) }, () =>
        worker()
      );
      await Promise.all(workers);
    },
    [items, runOne, concurrency]
  );

  const retry = useCallback(
    (i: number, meta: MetaBase) => runOne(i, meta),
    [runOne]
  );

  return { items, enqueue, reset, cancel, start, retry };
}
