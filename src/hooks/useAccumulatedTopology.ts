import { fetchAccumulatedTopology } from '@services/dashboard';
import { useQuery } from 'react-query';
import { AccumulatedApiResponse } from 'types/dashboard';

export const useAccumulatedTopology = (
  assignmentName: string,
  token: string
) => {
  return useQuery<AccumulatedApiResponse>({
    queryKey: ['accumulatedTopology', assignmentName],
    queryFn: () => fetchAccumulatedTopology(assignmentName, token),
    enabled: !!assignmentName && !!token,
    staleTime: 1000 * 60 * 5,
  });
};
