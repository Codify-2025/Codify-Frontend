import { useQuery } from 'react-query';
import { fetchSubject } from '@services/submit';

export const useSubjects = () =>
  useQuery<string[], Error>(['subjects'], fetchSubject, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });
