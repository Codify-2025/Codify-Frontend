/// 누적 네트워크 토폴로지

export interface AccumulatedNode {
  id: string; // 학번
  label: string; // 이름
}

export interface AccumulatedEdge {
  id: string; // fromId-toId 형식
  from: string;
  to: string;
  count: number; // 높은 유사도 누적 횟수
  value: number; // 평균 유사도
  width: number; // 시각화에 사용할 굵기 정보
}

export interface AccumulatedResponseData {
  nodes: AccumulatedNode[];
  edges: AccumulatedEdge[];
}

/// 저장된 분석 기록

export interface RecordNode {
  id: number;
  label: string;
}

export interface RecordWeekData {
  id: string;
  from: number;
  to: number;
  submittedFrom: string;
  submittedTo: string;
  value: number;
  width: number;
}

export interface RecordEdge {
  week: number;
  data: RecordWeekData[];
}

export interface RecordResponseData {
  nodes: RecordNode[];
  edges: RecordEdge[];
}

/// 대시보드 메인

export interface MainUser {
  userId: string;
  name: string;
}

export interface MainSubject {
  subjectId: number;
  subjectName: string;
}

export interface MainResponseData {
  user: MainUser;
  testCount: number; // 진행한 유사도 검사 횟수
  subjects: MainSubject[];
}
