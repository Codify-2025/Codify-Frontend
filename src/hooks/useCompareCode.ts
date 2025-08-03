import { compareRequest, fetchCompare } from '@services/result';
import { useQuery } from 'react-query';
import { compareApiResponse } from 'types/result';

export const useCompareCode = (params: compareRequest, token: string) => {
  return useQuery<compareApiResponse>({
    queryKey: ['compareCode', params.student1, params.student2],
    queryFn: () => fetchCompare(params, token),
    enabled: !!token && !!params.student1 && !!params.student2,
    staleTime: 1000 * 60 * 5,
  });
};
