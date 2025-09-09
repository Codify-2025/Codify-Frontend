import { fetchAccumulatedTopology } from '@services/dashboard';
import { AccumulatedResponseData } from '@typings/dashboard';
import { useQuery } from 'react-query';

export const useAccumulatedTopology = (subjectId: number | undefined) => {
  return useQuery<AccumulatedResponseData>({
    queryKey: ['accumulatedTopology', subjectId],
    queryFn: () => fetchAccumulatedTopology(subjectId!),
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 5,
  });
};
