import { addWeek, addWeekRequest } from '@services/submit';
import { useMutation } from 'react-query';
import { addWeekApiResponse } from 'types/submit';

export const useAddWeek = (token: string) => {
  return useMutation<addWeekApiResponse, Error, addWeekRequest>({
    mutationFn: (params) => addWeek(params, token),
  });
};
