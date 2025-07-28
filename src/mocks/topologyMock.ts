import { topologyApiResponse } from 'types/result';

export const topologyMock: topologyApiResponse = {
  status: 200,
  success: true,
  message: {
    nodes: [
      {
        id: '21000000',
        label: '학생 1',
        fildeName: '학생1.cpp',
        submittedAt: '2025-03-29 17:10',
        relatedFiles: [
          {
            fileName: '학생2.cpp',
            similarity: 0.92,
          },
          {
            fileName: '학생3.cpp',
            similarity: 0.87,
          },
        ],
      },
      {
        id: '21000001',
        label: '학생2',
        fildeName: '학생2.cpp',
        submittedAt: '2025-03-29 17:11',
        relatedFiles: [
          {
            fileName: '학생1.cpp',
            similarity: 0.92,
          },
          {
            fileName: '학생3.cpp',
            similarity: 0.75,
          },
        ],
      },
      {
        id: '21000002',
        label: '학생3',
        fildeName: '학생3.cpp',
        submittedAt: '2025-03-29 17:12',
        relatedFiles: [
          {
            fileName: '학생1.cpp',
            similarity: 0.92,
          },
          {
            fileName: '학생2.cpp',
            similarity: 0.75,
          },
        ],
      },
    ],
    edges: [
      {
        id: '21000000-21000001',
        from: '21000000',
        to: '21000001',
        value: 0.92,
        width: 9.2,
        comparedFiles: '학생1.cpp - 학생2.cpp',
        histories: [
          {
            submittedFrom: '2025-03-29 17:10',
            submittedTo: '2025-03-29 17:11',
          },
        ],
      },
      {
        id: '21000001-21000002',
        from: '21000001',
        to: '21000002',
        value: 0.75,
        width: 7.5,
        comparedFiles: '학생2.cpp - 학생3.cpp',
        histories: [
          {
            submittedFrom: '2025-03-29 17:11',
            submittedTo: '2025-03-29 17:12',
          },
        ],
      },
    ],
  },
};
