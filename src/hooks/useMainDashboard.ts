import { fetchMain } from '@services/dashboard';
import { useQuery } from 'react-query';
import { MainApiResponse } from 'types/dashboard';

export const useMainDashboard = (token: string) => {
  return useQuery<MainApiResponse>({
    queryKey: ['mainDashboard'],
    queryFn: () => fetchMain(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 10,
  });
};
