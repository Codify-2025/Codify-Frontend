import { graphRawMessage } from 'types/result';

export const graphMock: graphRawMessage = {
  nodes: [
    {
      id: 9007199254740991,
      label: 'string',
    },
  ],
  filterSummary: {
    total: 1073741824,
    aboveThreshold: 1073741824,
    belowThreshold: 1073741824,
    threshold: 0.1,
  },
  filterPairs: {
    aboveThreshold: [
      {
        fromId: 9007199254740991,
        toId: 9007199254740991,
        similarity: 0.1,
      },
    ],
    belowThreshold: [
      {
        fromId: 9007199254740991,
        toId: 9007199254740991,
        similarity: 0.1,
      },
    ],
  },
};
