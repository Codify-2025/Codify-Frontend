import { addAssignment, addAssignmentRequest } from '@services/submit';
import { useMutation } from 'react-query';
import { addAssignmentApiResponse } from 'types/submit';

export const useAddAssignment = (token: string) => {
  return useMutation<addAssignmentApiResponse, Error, addAssignmentRequest>({
    mutationFn: (params) => addAssignment(params, token),
  });
};
