/// 유사도 분석 결과 그래프

export interface graphNode {
  id: string;
  label: string;
}

export interface graphFilterSummary {
  total: number; // 검사된 총 파일 갯수
  aboveThreshold: number; // 유사도 임계선을 넘은 파일 갯수
  belowThreshold: number; // 유사도 임계선에 못 미치는 파일 갯수
  threshold: number; // 유사도 임계값
}

export interface graphPairThreshold {
  from: string;
  to: string;
  similarity: number;
}

export interface graphFilteredPair {
  aboveThreshold: graphPairThreshold[];
  belowThreshold: graphPairThreshold[];
}

export interface graphResponseData {
  nodes: graphNode[];
  filterSummary: graphFilterSummary;
  filteredPairs: graphFilteredPair[];
}

export interface graphApiResponse {
  status: number;
  success: boolean;
  message: graphResponseData;
}

/// 유사도 네트워크 토폴로지

export interface topologyRelatedFiles {
  fileName: string;
  similarity: number;
}

export interface topologyNode {
  id: string;
  label: string;
  fildeName: string;
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
  histories: topologyEdgeHistory;
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

export interface compareApiResponse {
  status: number;
  success: boolean;
  message: compareResponseData;
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

export interface saveApiResponse {
  status: number;
  success: boolean;
}
