import { addSubject, addSubjectRequest } from '@services/submit';
import { useMutation } from 'react-query';
import { addSubjectApiResponse } from 'types/submit';

export const useAddSubject = () => {
  return useMutation<addSubjectApiResponse, Error, addSubjectRequest>({
    mutationFn: (params) => addSubject(params),
  });
};
