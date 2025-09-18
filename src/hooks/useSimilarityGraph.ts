import { fetchGraph, fetchGraphRequest } from '@services/result';
import { useQuery } from 'react-query';
import type { graphMapped } from 'types/result';

export const useSimilarityGraph = (params: fetchGraphRequest) => {
  return useQuery<graphMapped>({
    queryKey: ['similarityGraph', params.assignmentId, params.week],
    queryFn: () => fetchGraph(params),
    enabled: !!params.assignmentId && !!params.week,
    staleTime: 1000 * 60 * 5,
  });
};
