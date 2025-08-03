import { fetchSubject } from '@services/submit';
import { useQuery } from 'react-query';
import { viewSubjectApiResponse } from 'types/submit';

export const useSubjects = (token: string) => {
  return useQuery<viewSubjectApiResponse>({
    queryKey: ['subjects'],
    queryFn: () => fetchSubject(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};
