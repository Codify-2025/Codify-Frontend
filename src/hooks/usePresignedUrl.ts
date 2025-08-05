import {
  getPresignedUrl,
  PresignedUrlRequest,
  PresignedUrlResponse,
} from '@services/submit';
import { useMutation } from 'react-query';

export const usePresignedUrl = (token: string) => {
  return useMutation<PresignedUrlResponse, Error, PresignedUrlRequest>({
    mutationFn: (params) => getPresignedUrl(params, token),
  });
};
