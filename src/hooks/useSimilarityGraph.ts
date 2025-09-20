import { fetchGraph, fetchGraphRequest } from '@services/result';
import { useQuery } from 'react-query';
import type { graphMapped } from 'types/result';
import { isDemo } from '@utils/demo';

export const useSimilarityGraph = (params: fetchGraphRequest) => {
  const enabled =
    Number.isFinite(params.assignmentId) && Number.isFinite(params.week);

  return useQuery<graphMapped>({
    queryKey: ['similarityGraph', demoOn, params.assignmentId, params.week],
    queryFn: () => fetchGraph(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
