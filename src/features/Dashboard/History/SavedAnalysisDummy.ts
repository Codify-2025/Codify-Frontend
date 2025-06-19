import { SavedAnalysisRecord } from './SavedAnalysisType';

export const savedAnalysisRecords: SavedAnalysisRecord[] = [
  {
    id: 'r001',
    assignmentName: '프로그래밍 입문',
    week: 1,
    type: 'group',
    savedAt: '2025-03-30T10:00:00',
  },
  {
    id: 'r002',
    assignmentName: '프로그래밍 입문',
    week: 1,
    type: 'pair',
    fileA: {
      id: '3',
      label: '학생3',
      submittedAt: '2025-03-29 17:00',
    },
    fileB: {
      id: '4',
      label: '학생4',
      submittedAt: '2025-03-29 17:01',
    },
    similarity: 95,
    savedAt: '2025-03-30T10:01:00',
  },
  {
    id: 'r003',
    assignmentName: '프로그래밍 입문',
    week: 2,
    type: 'group',
    savedAt: '2025-04-02T09:20:00',
  },
  {
    id: 'r004',
    assignmentName: '프로그래밍 입문',
    week: 2,
    type: 'pair',
    fileA: {
      id: '3',
      label: '학생3',
      submittedAt: '2025-04-01 17:00',
    },
    fileB: {
      id: '4',
      label: '학생4',
      submittedAt: '2025-04-01 17:01',
    },
    similarity: 95,
    savedAt: '2025-04-02T09:22:00',
  },
];
