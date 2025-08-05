import { graphApiResponse } from 'types/result';

export const graphMock: graphApiResponse = {
  status: 200,
  success: true,
  message: {
    nodes: [
      { id: '21000000', label: 'Student A' },
      { id: '21000001', label: 'Student B' },
      { id: '21000002', label: 'Student C' },
    ],
    filterSummary: {
      total: 3,
      aboveThreshold: 2,
      belowThreshold: 1,
      threshold: 0.7,
    },
    filteredPairs: {
      aboveThreshold: [
        {
          from: '21000000',
          to: '21000001',
          similarity: 0.88,
        },
      ],
      belowThreshold: [
        {
          from: '21000001',
          to: '21000002',
          similarity: 0.6,
        },
      ],
    },
  },
};
