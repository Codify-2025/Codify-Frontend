// useAnalyzePolling.ts
import { useQuery, useQueryClient } from 'react-query';
import { useState } from 'react';
import { getAnalyzeStatus, AnalyzeStatusResponse } from '@services/submit';

// 모듈 스코프 전역 플래그
let halted = false;
export const resetAnalyzePolling = () => {
  halted = false;
};

export const useAnalyzePolling = () => {
  const qc = useQueryClient();
  const [stopped, setStopped] = useState(halted);

  return useQuery<AnalyzeStatusResponse, Error>(
    ['similarity-analyze'],
    () => getAnalyzeStatus(),
    {
      enabled: !(halted || stopped),
      refetchInterval: (data) =>
        halted || stopped || data?.status === 'done' ? false : 1500,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 60_000,
      onSuccess: (data) => {
        if (data.status === 'done') {
          halted = true;
          setStopped(true);
          qc.cancelQueries(['similarity-analyze']);
        }
      },
    }
  );
};
