import { useMutation } from 'react-query';
import {
  createAssignmentWithWeek,
  type CreateAssignmentWithWeekRequest,
} from '@services/submit';
import { CreateAssignmentWithWeekResponse } from 'types/submit';

export const useCreateAssignmentWithWeek = () => {
  return useMutation<
    CreateAssignmentWithWeekResponse,
    Error,
    CreateAssignmentWithWeekRequest
  >({
    mutationFn: (params) => createAssignmentWithWeek(params),
  });
};
