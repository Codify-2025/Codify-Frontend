import { fetchMain } from '@services/dashboard';
import { useQuery } from 'react-query';
import { MainResponseData } from 'types/dashboard';

export const useMainDashboard = () => {
  return useQuery<MainResponseData>({
    queryKey: ['mainDashboard'],
    queryFn: fetchMain,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
