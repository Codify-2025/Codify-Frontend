import { RecordApiResponse } from 'types/dashboard';

export const recordMock: RecordApiResponse = {
  status: 200,
  success: true,
  message: {
    nodes: [
      { id: '21000000', label: 'Student A', submittedAt: '2025-04-11 14:00' },
      { id: '21000001', label: 'Student B', submittedAt: '2025-04-11 15:00' },
      { id: '21000002', label: 'Student C', submittedAt: '2025-04-11 15:00' },
    ],
    edges: [
      {
        week: 1,
        weekData: [
          {
            id: '21000000-21000001',
            from: '21000000',
            to: '21000001',
            value: 0.85,
            width: 8.5,
            histories: [
              {
                submittedFrom: '2025-04-11 14:00',
                submittedTo: '2025-04-11 15:00',
                similarity: 0.88,
              },
              {
                submittedFrom: '2025-04-18 13:40',
                submittedTo: '2025-04-18 13:45',
                similarity: 0.83,
              },
              {
                submittedFrom: '2025-04-25 12:30',
                submittedTo: '2025-04-25 12:31',
                similarity: 0.84,
              },
            ],
          },
        ],
      },
      {
        week: 2,
        weekData: [
          {
            id: '21000000-21000001',
            from: '21000000',
            to: '21000001',
            value: 0.85,
            width: 8.5,
            histories: [
              {
                submittedFrom: '2025-04-11 14:00',
                submittedTo: '2025-04-11 15:00',
                similarity: 0.88,
              },
              {
                submittedFrom: '2025-04-18 13:40',
                submittedTo: '2025-04-18 13:45',
                similarity: 0.83,
              },
              {
                submittedFrom: '2025-04-25 12:30',
                submittedTo: '2025-04-25 12:31',
                similarity: 0.84,
              },
            ],
          },
        ],
      },
    ],
  },
};
