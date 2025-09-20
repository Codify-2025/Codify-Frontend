import { fetchGraphRequest, fetchTopology } from '@services/result';
import { useQuery } from 'react-query';
import { topologyResponseData } from 'types/result';

export const useSimilarityTopology = (params: fetchGraphRequest) => {
  const enabled =
    Number.isFinite(params.assignmentId) && Number.isFinite(params.week);

  return useQuery<topologyResponseData>({
    queryKey: ['similarityTopology', params.assignmentId, params.week]
    queryFn: () => fetchTopology(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
