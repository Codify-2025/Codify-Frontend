import { useQuery } from 'react-query';
import { fetchJudge, judgeRequest } from '@services/result';
import type { judgeResponseData } from 'types/result';
import { isDemo } from '@utils/demo';

export const usePlagiarismJudge = (params: judgeRequest) => {
  const demoOn = isDemo('judge');
  const enabled =
    demoOn ||
    (!!params.assignmentId &&
      !!params.week &&
      !!params.studentFromId &&
      !!params.studentToId);

  return useQuery<judgeResponseData>({
    queryKey: [
      'judge',
      demoOn,
      params.assignmentId,
      params.week,
      params.studentFromId,
      params.studentToId,
    ],
    queryFn: () => fetchJudge(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
