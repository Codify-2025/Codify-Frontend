import {
  addAssignmentApiResponse,
  addSubjectApiResponse,
  addWeekApiResponse,
  analyzeApiResponse,
  viewSubjectApiResponse,
} from 'types/submit';
import axiosInstance from './axiosInstance';
import { addSubjectMock } from '@mocks/addSubjectMock';
import { viewSubjectMock } from '@mocks/viewSubjectMock';
import { addAssignmentMock } from '@mocks/addAssignmentMock';
import { addWeekMock } from '@mocks/addWeekMock';
import { analyzeMock } from '@mocks/analyzeMock';

/// 새로운 과목 추가

export interface addSubjectRequest {
  subjectName: string;
}

export const addSubject = async (
  { subjectName }: addSubjectRequest,
  token: string
): Promise<addSubjectApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return addSubjectMock;
  }

  const response = await axiosInstance.post<addSubjectApiResponse>(
    `/api/submit/subjects`,
    { subjectName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

/// 기존 과목 조회

export const fetchSubject = async (
  token: string
): Promise<viewSubjectApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return viewSubjectMock;
  }

  const response = await axiosInstance.get<viewSubjectApiResponse>(
    `/api/submit/subjects`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

/// 과제 생성

export interface addAssignmentRequest {
  subjectName: string;
  assignmentName: string;
}

export const addAssignment = async (
  { subjectName, assignmentName }: addAssignmentRequest,
  token: string
): Promise<addAssignmentApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return addAssignmentMock;
  }

  const response = await axiosInstance.post<addAssignmentApiResponse>(
    `api/submit/assignment`,
    { subjectName, assignmentName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

/// 주차 생성

export interface addWeekRequest {
  assignmentId: string;
  startDate: string;
  endDate: string;
  weekTitle: number;
}

export const addWeek = async (
  { assignmentId, startDate, endDate, weekTitle }: addWeekRequest,
  token: string
): Promise<addWeekApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return addWeekMock;
  }

  const response = await axiosInstance.post<addWeekApiResponse>(
    `/api/submit/week`,
    {
      assignmentId,
      startDate,
      endDate,
      weekTitle,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
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
