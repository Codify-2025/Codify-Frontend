import { fetchGraphRequest, fetchTopology } from '@services/result';
import { useQuery } from 'react-query';
import { topologyApiResponse } from 'types/result';

export const useSimilarityTopology = (
  params: fetchGraphRequest,
  token: string
) => {
  return useQuery<topologyApiResponse>({
    queryKey: ['similarityTopology', params.assignmentId, params.weekTitle],
    queryFn: () => fetchTopology(params, token),
    enabled: !!token && !!params.assignmentId && !!params.weekTitle,
    staleTime: 1000 * 60 * 5,
  });
};
