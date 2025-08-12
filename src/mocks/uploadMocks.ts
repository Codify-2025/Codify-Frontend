import type { PresignedResp } from 'types/upload';

const uuid = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID)
    return crypto.randomUUID();
  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// 파일명에 /, \ 같은 경로 구분자가 들어올 경우를 대비해 최소한의 정규화
const normalizeName = (name: string) => name.replace(/[\\/]/g, '_');

const makeS3Key = (id: string, fileName: string) =>
  `uploads/2/${id}/${fileName}`;

// Presigned (PUT)
export function makePresignedPutMock(fileName: string): PresignedResp {
  const safeName = normalizeName(fileName);
  const id = uuid();
  const s3Key = makeS3Key(id, safeName);

  return {
    method: 'PUT',
    url: `https://mock-s3.local/uploads/2/${id}/${encodeURIComponent(safeName)}`,
    headers: { 'x-amz-meta-demo': 'codify' },
    s3Key,
  };
}

// Presigned (POST)
export function makePresignedPostMock(fileName: string): PresignedResp {
  const safeName = normalizeName(fileName);
  const id = uuid();
  const s3Key = makeS3Key(id, safeName);

  return {
    method: 'POST',
    url: `https://mock-s3.local/uploads`,
    fields: {
      key: s3Key,
      Policy: 'mock-policy',
      'X-Amz-Signature': 'mock-sign',
    },
    s3Key,
  };
}

// S3 업로드 시뮬레이션(진행률 콜백 + 취소 지원)
export async function simulateS3UploadMock(
  onProgress?: (pct: number) => void,
  signal?: AbortSignal
): Promise<{ etag?: string }> {
  for (let p = 0; p <= 100; p += 20) {
    if (signal?.aborted) {
      // DOM 환경이면 DOMException, 아니면 일반 Error에 name만 세팅
      if (typeof DOMException !== 'undefined') {
        throw new DOMException('Aborted', 'AbortError');
      } else {
        const err = new Error('Aborted');
        err.name = 'AbortError';
        throw err;
      }
    }
    onProgress?.(p);
    await new Promise((r) => setTimeout(r, 120));
  }
  return { etag: `mock-etag-${uuid()}` };
}

export const registerUploadSuccessMock = {
  isSuccess: true,
  code: 'COMMON200',
  message: '요청에 성공했습니다.',
  result: { message: '파일이 성공적으로 업로드되었습니다.' },
};

export const registerUploadErrorMock = {
  isSuccess: false,
  code: 'COMMON500',
  message: '서버 오류',
  result: null,
};
