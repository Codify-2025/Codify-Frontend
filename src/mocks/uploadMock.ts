import { uploadApiResponse } from 'types/submit';

export const uploadMock: uploadApiResponse = {
  isSuccess: true,
  code: 'COMMON200',
  message: '요청에 성공했습니다.',
  result: {
    message: '파일이 성공적으로 업로드되었습니다.',
  },
};
