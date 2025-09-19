import { useQuery } from 'react-query';
import { getAnalyzeStatus, AnalyzeStatusResponse } from '@services/submit';

export const useAnalyzePolling = () => {
  return useQuery<AnalyzeStatusResponse, Error>(
    ['similarity-analyze'],
    () => getAnalyzeStatus(),
    {
      refetchInterval: (data) => {
        // "done" 전까지 폴링, 완료되면 멈춤
        if (!data) return 1500;
        return data.status === 'done' ? false : 1500; // 1.5s 간격
      },
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
    }
  );
};
