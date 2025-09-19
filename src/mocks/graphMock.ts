import { graphRawMessage } from 'types/result';

export const graphMock: graphRawMessage = {
  nodes: [
    { id: 1, label: '20230001_김민수.cpp' },
    { id: 2, label: '20230002_이서연.cpp' },
    { id: 3, label: '20230003_박지훈.cpp' },
    { id: 4, label: '20230004_최유진.cpp' },
    { id: 5, label: '20230005_정하늘.cpp' },
    { id: 6, label: '20230006_한도윤.cpp' },
    { id: 7, label: '20230007_오시윤.cpp' },
    { id: 8, label: '20230008_김도경.cpp' },
    { id: 9, label: '20230009_장민재.cpp' },
    { id: 10, label: '20230010_신가은.cpp' },
  ],
  filterSummary: {
    total: 10,
    threshold: 0.8, // 0~1
    aboveThreshold: 4, // 기준 초과 쌍 개수 (예시)
    belowThreshold: 6,
  },
  filterPairs: {
    aboveThreshold: [
      { fromId: 1, toId: 2, similarity: 0.92 },
      { fromId: 1, toId: 3, similarity: 0.87 },
      { fromId: 4, toId: 5, similarity: 0.83 },
      { fromId: 7, toId: 9, similarity: 0.81 },
    ],
    belowThreshold: [
      { fromId: 2, toId: 3, similarity: 0.75 },
      { fromId: 6, toId: 8, similarity: 0.62 },
      { fromId: 8, toId: 9, similarity: 0.59 },
      { fromId: 3, toId: 10, similarity: 0.56 },
      { fromId: 5, toId: 6, similarity: 0.49 },
      { fromId: 2, toId: 9, similarity: 0.41 },
    ],
  },
};
