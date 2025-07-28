import { viewSubjectApiResponse } from 'types/submit';

export const viewSubjectMock: viewSubjectApiResponse = {
  isSuccess: true,
  code: 'COMMON200',
  message: '과목 목록 조회 성공',
  result: ['운영체제', '알고리즘', '캡스톤디자인', '인공지능'],
};
