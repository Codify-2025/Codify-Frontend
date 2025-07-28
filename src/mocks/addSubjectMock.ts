import { addSubjectApiResponse } from 'types/submit';

export const addSubjectMock: addSubjectApiResponse = {
  isSuccess: true,
  code: 'COMMON200',
  message: '요청에 성공했습니다.',
  result: {
    subjectId: 1,
    message: '과제가 성공적으로 생성되었습니다.',
  },
};
