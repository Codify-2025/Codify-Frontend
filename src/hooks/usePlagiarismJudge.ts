import { compareRequest, fetchJudge } from '@services/result';
import { useQuery } from 'react-query';
import { judgeApiResponse } from 'types/result';

export const usePlagiarismJudge = (params: compareRequest, token: string) => {
  return useQuery<judgeApiResponse>({
    queryKey: ['plagiarismJudge', params.student1, params.student2],
    queryFn: () => fetchJudge(params, token),
    enabled: !!token && !!params.student1 && !!params.student2,
    staleTime: 1000 * 60 * 5,
  });
};
