import { fetchAnalyze } from '@services/submit';
import { useMutation } from 'react-query';
import { analyzeApiResponse } from 'types/submit';

export const useStartAnalysis = (token: string) => {
  return useMutation<analyzeApiResponse, Error, void>({
    mutationFn: () => fetchAnalyze(token),
  });
};
