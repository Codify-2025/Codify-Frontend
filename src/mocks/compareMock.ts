import { compareApiResponse } from 'types/result';

export const compareMock: compareApiResponse = {
  status: 200,
  success: true,
  message: {
    student1: {
      id: '21000000',
      name: 'Student A',
      fileName: 'file_name1.py',
      submissionTime: '2025-03-29 17:05',
      code: {
        code: [
          'int main() {',
          '  int a = 10;',
          '  int b = 20;',
          '  return a + b;',
          '}',
        ],
        lines: [2, 3],
      },
    },
    student2: {
      id: '21000001',
      name: 'Student B',
      fileName: 'file_name2.py',
      submissionTime: '2025-03-29 19:05',
      code: {
        code: [
          'int main() {',
          '  int a = 10;',
          '  int b = 20;',
          '  return a + b;',
          '}',
        ],
        lines: [2, 3],
      },
    },
  },
};
