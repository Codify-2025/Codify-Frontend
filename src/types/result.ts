// --- graph ---
export interface graphRawNode {
  id: number;
  label: string;
}

export interface graphRawFilterSummary {
  total: number;
  aboveThreshold: number;
  belowThreshold: number;
  threshold: number; // 서버는 0~1 실수, 코드에서 %로 변환
}

export interface graphRawPairItem {
  fromId: number;
  toId: number;
  similarity: number; // 서버는 0~1 실수, 코드에서 %로 변환
}

export interface graphRawFilterPairs {
  aboveThreshold: graphRawPairItem[];
  belowThreshold: graphRawPairItem[];
}

export interface graphRawMessage {
  nodes: graphRawNode[];
  filterSummary: graphRawFilterSummary;
  filterPairs: graphRawFilterPairs;
}

export interface graphNode {
  id: string;
  label: string;
}

export interface graphPairThreshold {
  from: string;
  to: string;
  similarity: number; // percent
}

export interface graphFilterSummary {
  total: number;
  aboveThreshold: number;
  belowThreshold: number;
  threshold: number; // percent
}

export interface graphMapped {
  nodes: graphNode[];
  summary: graphFilterSummary;
  pairs: {
    aboveThreshold: graphPairThreshold[];
    belowThreshold: graphPairThreshold[];
  };
}

// --- topology (래핑 없음) ---
export interface topologyRelatedFiles {
  fileName: string;
  similarity: number; // 0~1
}

export interface topologyNode {
  id: string;
  label: string;
  fileName: string;
  submittedAt: string;
  relatedFiles: topologyRelatedFiles[];
}

export interface topologyEdgeHistory {
  submittedFrom: string;
  submittedTo: string;
}

export interface topologyEdge {
  id: string;
  from: string;
  to: string;
  value: number; // 0~1
  width?: number; // 서버에 없으므로 선택값으로
  comparedFiles: string;
  histories: topologyEdgeHistory[];
}

export interface topologyResponseData {
  nodes: topologyNode[];
  edges: topologyEdge[];
}

// --- compare ---
export interface compareRawStudent {
  id: string;
  name: string;
  fileName: string;
  submissionTime: string;
  code: string[];
  lines: number[];
}

export interface compareRawResponse {
  student1: compareRawStudent;
  student2: compareRawStudent;
}

export interface compareCode {
  code: string[];
  lines: number[];
}

export interface compareStudent {
  id: string;
  name: string;
  fileName: string;
  submissionTime: string;
  code: compareCode;
}

export interface compareResponseData {
  student1: compareStudent;
  student2: compareStudent;
}

// --- judge ---
export interface judgeStudent {
  id: string;
  name: string;
  submittedTime: string;
}

export interface judgeResponseData {
  similarity: number;
  student1: judgeStudent;
  student2: judgeStudent;
}

export interface judgeApiResponse {
  status: number;
  success: boolean;
  message: judgeResponseData;
}

// --- save ---
export type saveApiResponse = string;

export interface saveStudentPayload {
  id: number | string;
  name: string;
  fileName: string;
  submittedTime: string;
}

export interface saveRequestPayload {
  assignmentId: number;
  week: number;
  plagiarize: boolean;
  student1: saveStudentPayload;
  student2: saveStudentPayload;
}
