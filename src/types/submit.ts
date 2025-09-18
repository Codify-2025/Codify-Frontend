// 기존 과목 조회

export interface SubjectItem {
  subjectId: number;
  subjectName: string;
}

/// 새로운 과목 추가

export interface addSubjectApiResponse {
  subjectId: number;
  subjectName: string;
}

// 과제 + 주차 생성

export interface CreateAssignmentWithWeekResponse {
  assignmentId: number;
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
