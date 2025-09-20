import type { judgeApiResponse } from 'types/result';

export const judgeMock: judgeApiResponse = {
  status: 200,
  success: true,
  message: {
    similarity: 0.91,
    student1: {
      id: '20230001',
      name: '김민수',
      submittedTime: '2025-03-18T10:00:00.000Z',
    },
    student2: {
      id: '20230002',
      name: '이서연',
      submittedTime: '2025-03-18T10:07:00.000Z',
    },
  },
};
