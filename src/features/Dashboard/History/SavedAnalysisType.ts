export type AnalysisType = 'group' | 'pair';

export interface BaseAnalysisRecord {
  id: string;
  subjectId: number;
  assignmentName: string;
  week: number;
  type: AnalysisType;
  savedAt: string;
}

export interface GroupAnalysisRecord extends BaseAnalysisRecord {
  type: 'group';
  preview?: {
    nodes: { id: string; label: string; submittedAt: string }[];
    edges: { from: string; to: string; similarity: number }[];
    stats: { pairs: number; maxSim: number; avgSim: number };
  };
}

export interface PairAnalysisRecord extends BaseAnalysisRecord {
  type: 'pair';
  fileA: { id: string; label: string; submittedAt: string };
  fileB: { id: string; label: string; submittedAt: string };
  similarity: number;
  width?: number;
}

export type SavedAnalysisRecord = GroupAnalysisRecord | PairAnalysisRecord;
