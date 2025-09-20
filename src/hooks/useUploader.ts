import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getPresignedUrl, registerUpload } from '@services/upload.api';
import { toLocalISOStringWithOffset } from '@utils/date';
import { MetaBase, UploadItemState } from '@typings/upload';

type GetPresignedUrlResponse =
  | { s3Key: string; url: string; headers?: Record<string, string> }
  | { s3Key: string; putUrl: string; headers?: Record<string, string> };

type PresignedPut = {
  url: string;
  s3Key: string;
  headers?: Record<string, string>;
};

// ===== S3 PUT helper =====
async function uploadFileToS3(
  file: File,
  presigned: PresignedPut,
  signal: AbortSignal,
  onProgress?: (pct: number) => void
) {
  await axios.put(presigned.url, file, {
    signal,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      ...(presigned.headers ?? {}),
    },
    onUploadProgress: (evt) => {
      if (!onProgress || !evt.total) return;
      const pct = Math.round((evt.loaded / evt.total) * 100);
      onProgress(pct);
    },
  });
}

// ===== Hook =====
export function useUploader(concurrency = 3) {
  const [items, setItems] = useState<UploadItemState[]>([]);
  const itemsRef = useRef<UploadItemState[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const abortControllersRef = useRef<Record<number, AbortController>>({});

  // 이번 start() 배치에서 "업로드가 완료된" 아이템들의 인덱스를
  // 완료 순서대로 쌓아두는 큐
  const completedOrderRef = useRef<number[]>([]);

  /** reset */
  const reset = useCallback(() => {
    setItems([]);
    abortControllersRef.current = {};
    completedOrderRef.current = [];
  }, []);

  /** enqueue: 파일 + 메타 고정 저장 */
  const enqueue = useCallback((entries: { file: File; meta: MetaBase }[]) => {
    setItems((prev) => {
      const appended = entries.map<UploadItemState>((e) => ({
        file: e.file,
        progress: 0,
        stage: 'idle',
        meta: { ...e.meta },
      }));
      const next = [...prev, ...appended];

      itemsRef.current = next;
      return next;
    });
  }, []);

  /** cancel */
  const cancel = useCallback((i: number) => {
    abortControllersRef.current[i]?.abort();
  }, []);

  /** 내부: presign + S3 업로드 (등록은 하지 않음) */
  const uploadOne = useCallback(async (i: number) => {
    const ac = new AbortController();
    abortControllersRef.current[i] = ac;

    const current = itemsRef.current;
    if (i < 0 || i >= current.length) {
      ac.abort();
      delete abortControllersRef.current[i];
      console.error(`Item at index ${i} not found`);
      return false;
    }
    const target = current[i];

    // 진행 중/완료는 스킵 (error/idle 허용)
    if (target.stage !== 'idle' && target.stage !== 'error') {
      delete abortControllersRef.current[i];
      return false;
    }

    const isAbortError = (e: unknown) =>
      (typeof DOMException !== 'undefined' &&
        e instanceof DOMException &&
        e.name === 'AbortError') ||
      (e instanceof Error && e.name === 'AbortError');

    try {
      // 1) presigning
      setItems((prev) =>
        prev.map((it, idx) =>
          idx === i
            ? { ...it, stage: 'presigning', error: undefined, progress: 0 }
            : it
        )
      );

      const m = target.meta!;
      if (!m) throw new Error('Missing meta for upload item');

      // 2) /api/upload/presigned-url
      const presignedRaw = (await getPresignedUrl(
        { fileName: target.file.name, assignmentId: m.assignmentId || 1 },
        ac.signal
      )) as GetPresignedUrlResponse;

      const presigned: PresignedPut = {
        url: 'url' in presignedRaw ? presignedRaw.url : presignedRaw.putUrl,
        s3Key: presignedRaw.s3Key,
        headers: presignedRaw.headers,
      };
      if (!presigned.url) throw new Error('Presigned URL을 받지 못했습니다.');

      // 3) S3 PUT
      setItems((prev) =>
        prev.map((it, idx) =>
          idx === i
            ? { ...it, stage: 'uploading', s3Key: presigned.s3Key, progress: 0 }
            : it
        )
      );

      await uploadFileToS3(target.file, presigned, ac.signal, (pct) => {
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, progress: Math.min(98, Math.max(0, pct)) } : it
          )
        );
      });

      // 업로드 완료 → 큐에 등록 순서를 기록
      completedOrderRef.current.push(i);

      // 표기 업데이트
      setItems((prev) =>
        prev.map((it, idx) =>
          idx === i ? { ...it, stage: 'uploaded', progress: 99 } : it
        )
      );

      return true;
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
      return false;
    } finally {
      delete abortControllersRef.current[i];
    }
  }, []);

  /** 내부: 서버 등록 (순차 처리) */
  const registerOne = useCallback(async (i: number, isLastFile: boolean) => {
    const it = itemsRef.current[i];
    if (!it?.meta || !it?.s3Key) return;

    const m = it.meta;
    setItems((prev) =>
      prev.map((x, idx) =>
        idx === i ? { ...x, stage: 'registering', progress: 99 } : x
      )
    );

    console.log('[registerUpload]', it.file.name, 'isLastFile=', isLastFile);

    await registerUpload(
      {
        assignmentId: m.assignmentId || 1,
        fileName: it.file.name,
        week: m.week,
        submissionDate: toLocalISOStringWithOffset(m.submissionDate),
        studentId: m.studentId,
        studentName: m.studentName,
        s3Key: it.s3Key,
        isLastFile, // ✅ 여기서 최종 결정
      }
      // 등록 실패는 바깥에서 axios 에러로 throw
    );

    setItems((prev) =>
      prev.map((x, idx) =>
        idx === i ? { ...x, stage: 'done', progress: 100 } : x
      )
    );
  }, []);

  /** start: 업로드(병렬) → 등록(완료 순서대로 직렬) */
  const start = useCallback(async () => {
    // 이번에 처리할 idle 인덱스 스냅샷
    const indicesToRun = itemsRef.current
      .map((it, idx) =>
        it.stage === 'idle' || it.stage === 'error' ? idx : -1
      )
      .filter((idx) => idx !== -1);

    if (indicesToRun.length === 0) return;

    // 새 배치 시작: 완료 순서 큐 초기화
    completedOrderRef.current = [];

    // ── 1) 업로드 단계: 병렬 실행 ─────────────────────────────
    let cursor = 0;
    async function worker() {
      while (true) {
        const next = indicesToRun[cursor++];
        if (next === undefined) break;
        await uploadOne(next);
      }
    }

    const workers = Array.from(
      { length: Math.min(concurrency, indicesToRun.length) },
      () => worker()
    );
    await Promise.all(workers); // 모든 업로드가 끝나야…

    // 업로드 성공한 것들만 완료 순서대로 큐에 있음
    const order = completedOrderRef.current.slice(); // 복사해서 사용

    if (order.length === 0) return;

    // ── 2) 등록 단계: 완료 순서대로 직렬 호출 ─────────────────
    for (let k = 0; k < order.length; k++) {
      const idx = order[k];
      const isLast = k === order.length - 1; // 마지막만 true
      await registerOne(idx, isLast);
    }
  }, [uploadOne, registerOne, concurrency]);

  /** retry: 실패한 개별 항목 재시도 (업로드→등록 순차) */
  const retry = useCallback(
    async (i: number) => {
      completedOrderRef.current = [];
      const ok = await uploadOne(i);
      if (!ok) return;
      // 단일 재시도는 자기 자신이 "마지막"이므로 true
      await registerOne(i, true);
    },
    [uploadOne, registerOne]
  );

  return { items, enqueue, reset, cancel, start, retry };
}
