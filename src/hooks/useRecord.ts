import { fetchRecord } from '@services/dashboard';
import { RecordResponseData } from '@typings/dashboard';
import { useQuery } from 'react-query';

export const useRecord = (subjectId?: number) => {
  return useQuery<RecordResponseData>({
    queryKey: ['record', subjectId],
    queryFn: () => fetchRecord(subjectId!),
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
