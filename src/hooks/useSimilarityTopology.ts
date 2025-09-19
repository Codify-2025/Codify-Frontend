import { fetchGraphRequest, fetchTopology } from '@services/result';
import { useQuery } from 'react-query';
import { topologyApiResponse } from 'types/result';
import { isDemo } from '@utils/demo';

export const useSimilarityTopology = (params: fetchGraphRequest) => {
  const demoOn = isDemo('topology');
  const enabled = demoOn || (!!params.assignmentId && !!params.week);

  return useQuery<topologyApiResponse>({
    // 데모 상태를 key에 포함 → 데모 on/off 시 새로 fetch
    queryKey: ['similarityTopology', demoOn, params.assignmentId, params.week],
    queryFn: () => fetchTopology(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
