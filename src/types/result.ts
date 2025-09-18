/// 유사도 분석 결과 그래프

export interface graphRawNode {
  id: number;
  label: string;
}

export interface graphRawFilterSummary {
  total: number;
  aboveThreshold: number;
  belowThreshold: number;
  threshold: number;
}

export interface graphRawPairItem {
  fromId: number;
  toId: number;
  similarity: number;
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
  similarity: number;
}

export interface graphFilterSummary {
  total: number;
  aboveThreshold: number;
  belowThreshold: number;
  threshold: number;
}

export interface graphMapped {
  nodes: graphNode[];
  summary: graphFilterSummary;
  pairs: {
    aboveThreshold: graphPairThreshold[];
    belowThreshold: graphPairThreshold[];
  };
}

/// 유사도 네트워크 토폴로지

export interface topologyRelatedFiles {
  fileName: string;
  similarity: number;
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
  value: number;
  width: number;
  comparedFiles: string;
  histories: topologyEdgeHistory[];
}

export interface topologyResponseData {
  nodes: topologyNode[];
  edges: topologyEdge[];
}

export interface topologyApiResponse {
  status: number;
  success: boolean;
  message: topologyResponseData;
}

/// 유사도 코드 비교

// --- [compare: Raw from server] ---
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

// --- [compare: Mapped for UI] ---
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

/// 표절 판단

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

/// 결과 저장

export type saveApiResponse = string;

// 요청에 넣을 학생 타입
export interface saveStudentPayload {
  id: number | string;
  name: string;
  fileName: string;
  submittedTime: string;
}

// 저장 요청 본문 + 쿼리 파라미터(week)와 path 파라미터(assignmentId)
export interface saveRequestPayload {
  assignmentId: number;
  week: number;
  plagiarize: boolean;
  student1: saveStudentPayload;
  student2: saveStudentPayload;
}
