/// 새로운 과목 추가

export interface addSubjectResult {
  subjectId: number;
  message: string; // 성공 여부 안내 메시지
}

export interface addSubjectApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: addSubjectResult[];
}

/// 기존 과목 조회

export interface viewSubjectApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string[];
}

// 과제 생성

export interface addAssignmentResult {
  assignmentId: number;
  message: string;
}

export interface addAssignmentApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: addAssignmentResult[];
}

/// 주차 생성

export interface addWeekResult {
  message: string;
}

export interface addWeekApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: addWeekResult;
}

/// 파일 업로드

export interface uploadResult {
  message: string;
}

export interface uploadApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: uploadResult;
}

/// 유사도 분석

export interface analyzeResponseData {
  status: string;
}

export interface analyzeApiResponse {
  status: number;
  success: boolean;
  message: analyzeResponseData;
}
