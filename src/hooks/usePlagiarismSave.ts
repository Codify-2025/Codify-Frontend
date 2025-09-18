import { useMutation } from 'react-query';
import { savePlagiarismResult } from '@services/result';
import type { saveRequestPayload, saveApiResponse } from 'types/result';

export const usePlagiarismSave = () => {
  return useMutation<saveApiResponse, unknown, saveRequestPayload>((payload) =>
    savePlagiarismResult(payload)
  );
};
