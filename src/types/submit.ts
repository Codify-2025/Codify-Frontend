/// 새로운 과목 추가

export interface addSubjectApiResponse {
  subjectId: number;
}

// 과제 생성

export interface addAssignmentResult {
  assignmentId: string;
  message: string;
}

export interface addAssignmentApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: addAssignmentResult;
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

/// 유사도 분석

export interface analyzeResponseData {
  status: string;
}

export interface analyzeApiResponse {
  status: number;
  success: boolean;
  message: analyzeResponseData;
}
