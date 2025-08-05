import { MainApiResponse } from 'types/dashboard';

export const mainMock: MainApiResponse = {
  status: 200,
  success: true,
  message: {
    user: {
      userId: 123,
      userName: '사용자',
    },
    testCount: 5,
    subjects: [
      {
        subjectId: 1,
        subjectName: '프로그래밍 입문',
      },
      {
        subjectId: 2,
        subjectName: '공학 수학',
      },
    ],
  },
};
