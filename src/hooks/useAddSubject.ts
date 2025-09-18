import { addSubject, addSubjectRequest } from '@services/submit';
import { useMutation } from 'react-query';
import { AddSubjectApiResponse } from 'types/submit';

export const useAddSubject = () => {
  return useMutation<AddSubjectApiResponse, Error, addSubjectRequest>({
    mutationFn: (params) => addSubject(params),
  });
};
