import { fetchRecord } from '@services/dashboard';
import { useQuery } from 'react-query';
import { RecordApiResponse } from 'types/dashboard';

export const useRecord = (token: string) => {
  return useQuery<RecordApiResponse>({
    queryKey: ['record'],
    queryFn: () => fetchRecord(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};
