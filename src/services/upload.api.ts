import axios from 'axios';
import axiosInstance from './axiosInstance';
import type { PresignedResp, UploadMetaReq } from '@typings/upload';
import {
  makePresignedPutMock,
  simulateS3UploadMock,
  registerUploadSuccessMock,
} from '@mocks/uploadMocks';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Presigned 발급
export async function getPresignedUrl(
  params: {
    fileName: string;
    contentType: string;
    assignmentId: number;
    week: number;
    studentId: number;
  },
  signal?: AbortSignal
): Promise<PresignedResp> {
  if (USE_MOCK) {
    // PUT/POST 중 원하는 형태 반환
    return makePresignedPutMock(params.fileName);
    // return makePresignedPostMock(params.fileName);
  }

  const { data } = await axiosInstance.post('/api/presigned', params, {
    headers:
      import.meta.env.MODE === 'development' &&
      import.meta.env.VITE_UPLOAD_DEV_PASSWORD
        ? { 'x-dev-password': import.meta.env.VITE_UPLOAD_DEV_PASSWORD }
        : {},
    signal,
  });
  return data.result as PresignedResp;
}

// S3 업로드 (PUT/POST 모두 지원)
export async function uploadToS3(
  file: File,
  presigned: PresignedResp,
  onProgress?: (pct: number) => void,
  signal?: AbortSignal
) {
  if (USE_MOCK) {
    // 실제 네트워크 대신 진행률/ETag만 시뮬레이션
    return simulateS3UploadMock(onProgress);
  }

  if (presigned.method === 'PUT') {
    const res = await axios.put(presigned.url, file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        ...(presigned.headers || {}),
      },
      onUploadProgress: (e) =>
        e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
      signal,
    });
    const etag = (res.headers?.etag as string | undefined)?.replaceAll('"', '');
    return { etag };
  } else {
    const fd = new FormData();
    Object.entries(presigned.fields).forEach(([k, v]) => fd.append(k, v));
    fd.append('file', file);

    const res = await axios.post(presigned.url, fd, {
      onUploadProgress: (e) =>
        e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
      signal,
    });
    const etag = (res.headers?.etag as string | undefined)?.replaceAll('"', '');
    return { etag };
  }
}

// 메타데이터 등록
export async function registerUpload(
  meta: UploadMetaReq,
  signal?: AbortSignal
) {
  if (USE_MOCK) {
    // 실제와 유사하게 약간의 지연 후 성공 응답 반환
    await new Promise((r) => setTimeout(r, 200));
    return registerUploadSuccessMock;
  }

  try {
    const { data } = await axiosInstance.post('/api/upload', meta, { signal });
    return data;
  } catch (error) {
    console.error('Failed to register upload:', error);
    throw error;
  }
}
