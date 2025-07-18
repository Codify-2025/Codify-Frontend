export type AnalysisType = 'group' | 'pair';

export interface BaseAnalysisRecord {
  id: string;
  assignmentName: string;
  week: number;
  type: AnalysisType;
  savedAt: string;
}

export interface GroupAnalysisRecord extends BaseAnalysisRecord {
  type: 'group';
}

export interface PairAnalysisRecord extends BaseAnalysisRecord {
  type: 'pair';
  fileA: {
    id: string;
    label: string;
    submittedAt: string;
  };
  fileB: {
    id: string;
    label: string;
    submittedAt: string;
  };
  similarity: number;
}

export type SavedAnalysisRecord = GroupAnalysisRecord | PairAnalysisRecord;
