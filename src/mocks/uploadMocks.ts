import type { PresignedResp } from 'types/upload';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const uuid = () =>
  Math.random().toString(16).slice(2) + Date.now().toString(16);

// Presigned (PUT)
export function makePresignedPutMock(fileName: string): PresignedResp {
  const id = uuid();
  return {
    method: 'PUT',
    url: `https://mock-s3.local/uploads/2/${id}/${encodeURIComponent(fileName)}`,
    headers: { 'x-amz-meta-demo': 'codify' },
    s3Key: `uploads/2/${id}/${fileName}`,
  };
}

// Presigned (POST)
export function makePresignedPostMock(fileName: string): PresignedResp {
  const id = uuid();
  return {
    method: 'POST',
    url: `https://mock-s3.local/uploads`,
    fields: {
      key: `uploads/2/${id}/${fileName}`,
      Policy: 'mock-policy',
      'X-Amz-Signature': 'mock-sign',
    },
    s3Key: `uploads/2/${id}/${fileName}`,
  };
}

// S3 업로드 시뮬레이션(진행률 콜백 호출 + ETag 반환)
export async function simulateS3UploadMock(
  onProgress?: (pct: number) => void
): Promise<{ etag?: string }> {
  for (let p = 0; p <= 100; p += 20) {
    onProgress?.(p);
    await sleep(120);
  }
  return { etag: `mock-etag-${uuid()}` };
}

// /api/upload 성공 응답
export const registerUploadSuccessMock = {
  isSuccess: true,
  code: 'COMMON200',
  message: '요청에 성공했습니다.',
  result: { message: '파일이 성공적으로 업로드되었습니다.' },
};

// 실패 응답
export const registerUploadErrorMock = {
  isSuccess: false,
  code: 'COMMON500',
  message: '서버 오류',
  result: null,
};
