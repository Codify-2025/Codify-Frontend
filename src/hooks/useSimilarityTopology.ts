import { fetchGraphRequest, fetchTopology } from '@services/result';
import { useQuery } from 'react-query';
import { topologyResponseData } from 'types/result';

export const useSimilarityTopology = (params: fetchGraphRequest) => {
  const isValidId =
    Number.isInteger(params.assignmentId) && params.assignmentId > 0;
  const isValidWeek = Number.isInteger(params.week) && params.week > 0;
  const enabled = isValidId && isValidWeek;

  return useQuery<topologyResponseData>({
    queryKey: ['similarityTopology', params.assignmentId, params.week],
    queryFn: () => fetchTopology(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
