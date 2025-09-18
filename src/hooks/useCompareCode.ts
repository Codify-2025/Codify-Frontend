import { compareRequest, fetchCompare } from '@services/result';
import { useQuery } from 'react-query';
import type { compareResponseData } from 'types/result';

export const useCompareCode = (params: compareRequest) => {
  const enabled =
    !!params.assignmentId &&
    !!params.week &&
    !!params.studentFromId &&
    !!params.studentToId;

  return useQuery<compareResponseData>({
    queryKey: [
      'compareCode',
      params.assignmentId,
      params.week,
      params.studentFromId,
      params.studentToId,
    ],
    queryFn: () => fetchCompare(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
