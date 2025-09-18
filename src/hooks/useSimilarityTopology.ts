import { fetchGraphRequest, fetchTopology } from '@services/result';
import { useQuery } from 'react-query';
import { topologyApiResponse } from 'types/result';

export const useSimilarityTopology = (params: fetchGraphRequest) => {
  const enabled = !!params.assignmentId && !!params.week;

  return useQuery<topologyApiResponse>({
    queryKey: ['similarityTopology', params.assignmentId, params.week],
    queryFn: () => fetchTopology(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
