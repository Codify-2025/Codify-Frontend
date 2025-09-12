import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getPresignedUrl, registerUpload } from '@services/upload.api';
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

export function useUploader(concurrency = 3) {
  const [items, setItems] = useState<UploadItemState[]>([]);
  const itemsRef = useRef<UploadItemState[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const queueIndexRef = useRef<number>(0);
  const abortControllersRef = useRef<Record<number, AbortController>>({});

  const reset = useCallback(() => {
    setItems([]);
    queueIndexRef.current = 0;
    abortControllersRef.current = {};
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
    abortControllersRef.current[i]?.abort();
  }, []);

  const runOne = useCallback(
    async (i: number, metaOrDeriver: MetaBase | MetaDeriver) => {
      const ac = new AbortController();
      abortControllersRef.current[i] = ac;

      const current = itemsRef.current;
      if (i < 0 || i >= current.length) {
        ac.abort();
        delete abortControllersRef.current[i];
        console.error(`Item at index ${i} not found`);
        return;
      }

      const target = current[i];

      // 이미 presigning/ uploading/ registering/ done/ error 면 스킵
      if (target.stage !== 'idle') {
        delete abortControllersRef.current[i];
        return;
      }

      // 1) presigning
      setItems((prev) =>
        prev.map((it, idx) =>
          idx === i ? { ...it, stage: 'presigning', error: undefined } : it
        )
      );

      const isAbortError = (e: unknown) =>
        (typeof DOMException !== 'undefined' &&
          e instanceof DOMException &&
          e.name === 'AbortError') ||
        (e instanceof Error && e.name === 'AbortError');

      try {
        const m: MetaBase =
          typeof metaOrDeriver === 'function'
            ? (metaOrDeriver as MetaDeriver)(target.file, i)
            : (metaOrDeriver as MetaBase);

        // 2) /api/upload/presigned-url → s3Key 수령
        const presigned = await getPresignedUrl(
          { fileName: target.file.name, assignmentId: m.assignmentId || 1 },
          ac.signal
        );
        if (ac.signal.aborted) throw new DOMException('Aborted', 'AbortError');

        // 3) registering (S3 PUT 없음)
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? { ...it, stage: 'registering', s3Key: presigned.s3Key }
              : it
          )
        );

        // 4) /api/upload — 상태코드만 확인
        await registerUpload(
          {
            assignmentId: m.assignmentId || 1,
            fileName: target.file.name,
            week: m.week,
            submissionDate: toLocalISOStringWithOffset(m.submissionDate),
            studentId: m.studentId,
            studentName: m.studentName,
            s3Key: presigned.s3Key,
          },
          ac.signal
        );

        // 5) done
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, stage: 'done', progress: 100 } : it
          )
        );
      } catch (err) {
        const canceled =
          (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') ||
          isAbortError(err);

        const message = canceled
          ? '업로드가 취소되었습니다.'
          : axios.isAxiosError(err)
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
      // 이번에 돌릴 대상은 idle 상태인 아이템만 추출
      const indicesToRun = itemsRef.current
        .map((it, idx) => (it.stage === 'idle' ? idx : -1))
        .filter((idx) => idx !== -1);

      if (indicesToRun.length === 0) return;

      let cursor = 0; // 이 배열용 커서
      async function worker() {
        while (true) {
          const next = indicesToRun[cursor++];
          if (next === undefined) break;
          await runOne(next, metaOrDeriver);
        }
      }

      const workers = Array.from(
        { length: Math.min(concurrency, indicesToRun.length) },
        () => worker()
      );
      await Promise.all(workers);
    },
    [runOne, concurrency]
  );

  const retry = useCallback(
    (i: number, meta: MetaBase) => runOne(i, meta),
    [runOne]
  );

  return { items, enqueue, reset, cancel, start, retry };
}
