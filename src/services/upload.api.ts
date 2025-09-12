import axios from 'axios';
import axiosInstance from './axiosInstance';

export type PresignedPut = {
  method: 'PUT';
  url: string;
  s3Key: string;
  headers?: Record<string, string>;
};

export interface UploadMetaReq {
  assignmentId: number;
  fileName: string;
  week: number;
  submissionDate: string;
  studentId: number;
  studentName: string;
  s3Key: string;
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Presigned 발급
export async function getPresignedUrl(
  params: { fileName: string; assignmentId: number },
  signal?: AbortSignal
): Promise<PresignedPut> {
  if (USE_MOCK) {
    return {
      method: 'PUT',
      url: 'https://example-s3/presigned-put',
      s3Key: `mock/${params.fileName}`,
    };
  }

  const { data } = await axiosInstance.get('/api/upload/presigned-url', {
    params: { filename: params.fileName, assignmentId: params.assignmentId },
    signal,
  });

  return { method: 'PUT', url: data.preSignedUrl, s3Key: data.key };
}

/**
 * 업로드 등록 호출만 수행. 바디 없는 응답(201/204/200 등)도 모두 성공으로 처리.
 * 실패 시 예외 throw.
 */
export async function registerUpload(
  meta: UploadMetaReq,
  signal?: AbortSignal
): Promise<void> {
  const payload = {
    assignmentId: meta.assignmentId,
    fileName: meta.fileName,
    week: meta.week,
    submissionDate: new Date(meta.submissionDate).toISOString(),
    studentId: meta.studentId,
    studentName: meta.studentName,
    s3Key: meta.s3Key,
  };

  try {
    const res = await axiosInstance.post('/api/upload', payload, {
      signal,
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status < 200 || res.status >= 300) {
      throw new Error(`Upload API failed. status=${res.status}`);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const s = err.response?.status;
      const msg =
        err.response?.data?.message ??
        err.message ??
        'Upload API request failed.';
      throw new Error(
        s ? `Upload API ${s}: ${msg}` : `Upload API error: ${msg}`
      );
    }
    throw err instanceof Error ? err : new Error('Unknown upload API error');
  }
}
