import { addAssignmentApiResponse } from 'types/submit';

export const addAssignmentMock: addAssignmentApiResponse = {
  isSuccess: true,
  code: 'COMMON200',
  message: '요청에 성공했습니다.',
  result: {
    assignmentId: 1,
    message: '과제가 성공적으로 생성되었습니다.',
  },
};
