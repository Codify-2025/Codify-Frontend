import { judgeApiResponse } from 'types/result';

export const judgeMock: judgeApiResponse = {
  status: 200,
  success: true,
  message: {
    similarity: 95,
    student1: {
      id: '21000000',
      name: 'Student A',
      submittedTime: '2025-03-29 17:06',
    },
    student2: {
      id: '21000001',
      name: 'Student B',
      submittedTime: '2025-03-30 17:06',
    },
  },
};
