import { compareRequest, fetchCompare } from '@services/result';
import { useQuery } from 'react-query';
import type { compareResponseData } from 'types/result';
import { isDemo } from '@utils/demo';

export const useCompareCode = (params: compareRequest) => {
  const demoOn = isDemo('compare');
  const enabled =
    demoOn ||
    (!!params.assignmentId &&
      !!params.week &&
      !!params.studentFromId &&
      !!params.studentToId);

  return useQuery<compareResponseData>({
    queryKey: [
      'compareCode',
      demoOn,
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
