import { save, saveRequest } from '@services/result';
import { useMutation } from 'react-query';
import { saveApiResponse } from 'types/result';

export const useSaveResult = (token: string) => {
  return useMutation<saveApiResponse, Error, saveRequest>({
    mutationFn: (params) => save(params, token),
  });
};
