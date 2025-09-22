import { useQuery } from 'react-query';
import { fetchJudge, judgeRequest } from '@services/result';
import type { judgeResponseData } from 'types/result';

export const usePlagiarismJudge = (params: judgeRequest) => {
  const enabled =
    !!params.assignmentId &&
    !!params.week &&
    !!params.studentFromId &&
    !!params.studentToId;

  return useQuery<judgeResponseData>({
    queryKey: [
      'judge',
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
