import {
  addSubjectApiResponse,
  analyzeApiResponse,
  CreateAssignmentWithWeekResponse,
  SubjectItem,
} from 'types/submit';
import axiosInstance from './axiosInstance';
import { addSubjectMock } from '@mocks/addSubjectMock';
import { viewSubjectMock } from '@mocks/viewSubjectMock';
import { analyzeMock } from '@mocks/analyzeMock';

/// 새로운 과목 추가

export interface addSubjectRequest {
  subjectName: string;
}

export const addSubject = async ({
  subjectName,
}: addSubjectRequest): Promise<addSubjectApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return addSubjectMock;
  }

  const res = await axiosInstance.post<addSubjectApiResponse>(
    '/api/submit/subjects',
    { subjectName }
  );
  return res.data;
};

/// 기존 과목 조회

export const fetchSubject = async (): Promise<SubjectItem[]> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return (viewSubjectMock as string[]).map((subjectName, idx) => ({
      subjectId: idx + 1,
      subjectName,
    }));
  }

  const res = await axiosInstance.get<SubjectItem[]>('/api/submit/subjects');
  return res.data;
};

/// 과제 + 주차 생성

export interface CreateAssignmentWithWeekRequest {
  subjectId: number;
  assignmentName: string;
  startDate: string;
  endDate: string;
  week: number;
}

export const createAssignmentWithWeek = async ({
  subjectId,
  assignmentName,
  startDate,
  endDate,
  week,
}: CreateAssignmentWithWeekRequest): Promise<CreateAssignmentWithWeekResponse> => {
  const res = await axiosInstance.post<CreateAssignmentWithWeekResponse>(
    `/api/submit/subjects/${subjectId}/assignments`,
    { assignmentName, startDate, endDate, week }
  );
  return res.data;
};

/// 유사도 분석

export const fetchAnalyze = async (
  token: string
): Promise<analyzeApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return analyzeMock;
  }

  const response = await axiosInstance.get<analyzeApiResponse>(
    `/api/submit/analyze`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
