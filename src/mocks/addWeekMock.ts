import { addWeekApiResponse } from 'types/submit';

export const addWeekMock: addWeekApiResponse = {
  isSuccess: true,
  code: 'COMMON200',
  message: '요청에 성공했습니다.',
  result: {
    message: '주차가 성공적으로 생성되었습니다.',
  },
};
