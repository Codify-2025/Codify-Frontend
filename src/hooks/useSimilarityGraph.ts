import { fetchGraph, fetchGraphRequest } from '@services/result';
import { useQuery } from 'react-query';
import { graphApiResponse } from 'types/result';

export const useSimilarityGraph = (
  params: fetchGraphRequest,
  token: string
) => {
  return useQuery<graphApiResponse>({
    queryKey: ['similarityGraph', params.assignmentId, params.weekTitle],
    queryFn: () => fetchGraph(params, token),
    enabled: !!token && !!params.assignmentId && !!params.weekTitle,
    staleTime: 1000 * 60 * 5,
  });
};
