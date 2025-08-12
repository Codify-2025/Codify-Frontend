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

export function useUploader(concurrency = 3) {
  const [items, setItems] = useState<UploadItemState[]>([]);
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
    const ac = abortControllersRef.current[i];
    ac?.abort();
  }, []);

  const runOne = useCallback(
    async (i: number, metaOrDeriver: MetaBase | MetaDeriver) => {
      // presign 이전에 AbortController 준비
      const ac = new AbortController();
      abortControllersRef.current[i] = ac;

      // 최신 아이템 캡처 + presigning 표시
      let target: UploadItemState | undefined;
      setItems((prev) => {
        target = prev[i];
        return prev.map((it, idx) =>
          idx === i ? { ...it, stage: 'presigning', error: undefined } : it
        );
      });

      if (!target) {
        // 인덱스가 유효하지 않으면 안전 종료
        ac.abort();
        delete abortControllersRef.current[i];
        console.error(`Item at index ${i} not found`);
        return;
      }

      // 파일 상단(또는 훅 안 최상단)에 추가
      type UploadApiError = { message?: string; code?: string };

      // AbortError 판별용 타입 가드
      function isAbortError(e: unknown): boolean {
        // DOM 환경/브라우저
        if (typeof DOMException !== 'undefined' && e instanceof DOMException) {
          return e.name === 'AbortError';
        }
        // 일부 런타임은 일반 Error로 전달
        return e instanceof Error && e.name === 'AbortError';
      }

      try {
        const m: MetaBase =
          typeof metaOrDeriver === 'function'
            ? (metaOrDeriver as MetaDeriver)(target.file, i)
            : (metaOrDeriver as MetaBase);

        // presign에도 signal 전달
        const presigned = await getPresignedUrl(
          {
            fileName: target.file.name,
            contentType: target.file.type || 'application/octet-stream',
            assignmentId: m.assignmentId,
            week: m.week,
            studentId: m.studentId,
          },
          ac.signal
        );

        // 취소가 이미 눌렸다면 즉시 중단
        if (ac.signal.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }

        // 업로드 시작 표시
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i
              ? { ...it, stage: 'uploading', s3Key: presigned.s3Key }
              : it
          )
        );

        // S3 업로드 (signal + 진행률 업데이트)
        const { etag } = await uploadToS3(
          target.file,
          presigned,
          (pct) =>
            setItems((prev) =>
              prev.map((it, idx) => (idx === i ? { ...it, progress: pct } : it))
            ),
          ac.signal
        );

        // 등록 단계 표시
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, stage: 'registering', etag } : it
          )
        );

        // 메타 등록에도 signal 전달
        await registerUpload(
          {
            assignmentId: m.assignmentId,
            fileName: target.file.name,
            week: m.week,
            submissionDate: toLocalISOStringWithOffset(m.submissionDate),
            studentId: m.studentId,
            studentName: m.studentName,
            s3Key: presigned.s3Key,
            ...(etag ? { etag } : {}),
          },
          ac.signal
        );

        // 완료
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, stage: 'done', progress: 100 } : it
          )
        );
      } catch (err: unknown) {
        // 취소 케이스 일관 처리 (any 사용 금지)
        const isCanceled =
          (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') ||
          isAbortError(err);

        const message = isCanceled
          ? '업로드가 취소되었습니다.'
          : axios.isAxiosError<UploadApiError>(err)
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
        // 컨트롤러 정리
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
