import { useQuery } from 'react-query';
import { fetchSubject } from '@services/submit';
import { SubjectItem } from '@typings/submit';

export const useSubjects = () =>
  useQuery<SubjectItem[], Error>(['subjects'], fetchSubject, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });
