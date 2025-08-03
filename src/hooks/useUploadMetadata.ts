import { submitUploadMetadata, UploadMetadataRequest } from '@services/submit';
import { useMutation } from 'react-query';
import { uploadApiResponse } from 'types/submit';

export const useUploadMetadata = (token: string) => {
  return useMutation<uploadApiResponse, Error, UploadMetadataRequest>({
    mutationFn: (params) => submitUploadMetadata(params, token),
  });
};
