import {
  addAssignmentApiResponse,
  addSubjectApiResponse,
  addWeekApiResponse,
  analyzeApiResponse,
  uploadApiResponse,
  viewSubjectApiResponse,
} from 'types/submit';
import axiosInstance from './axiosInstance';
import { addSubjectMock } from 'mocks/addSubjectMock';
import { viewSubjectMock } from 'mocks/viewSubjectMock';
import { addAssignmentMock } from 'mocks/addAssignmentMock';
import { addWeekMock } from 'mocks/addWeekMock';
import { uploadMock } from 'mocks/uploadMock';
import { analyzeMock } from 'mocks/analyzeMock';

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

  const formData = new FormData();
  formData.append('subjectName', subjectName);

  const response = await axiosInstance.post<addSubjectApiResponse>(
    `api/submit/subjects`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
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
    `api/submit/subjects`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

/// 과제 생성

export interface addAssignmentRequest {
  assignmentId: string;
  assignmentName: string;
}

export const addAssignment = async (
  { assignmentId, assignmentName }: addAssignmentRequest,
  token: string
): Promise<addAssignmentApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return addAssignmentMock;
  }

  const formData = new FormData();
  formData.append('assignmentId', assignmentId);
  formData.append('assignmentName', assignmentName);

  const response = await axiosInstance.post<addAssignmentApiResponse>(
    `api/submit/assignment`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

/// 주차 생성

export interface addWeekRequest {
  assignmentId: number;
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

  const formData = new FormData();
  formData.append('assignmentId', String(assignmentId));
  formData.append('startDate', startDate);
  formData.append('endDate', endDate);
  formData.append('weekTitle', String(weekTitle));

  const response = await axiosInstance.post<addWeekApiResponse>(
    `api/submit/week`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

/// 파일 업로드

export interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
}

export interface PresignedUrlResponse {
  url: string; // presigned upload URL
  key: string; // S3 object key
}

export const getPresignedUrl = async (
  { fileName, contentType }: PresignedUrlRequest,
  token: string
): Promise<PresignedUrlResponse> => {
  const response = await axiosInstance.post<PresignedUrlResponse>(
    `api/s3/presign`, // 실제 백엔드 presigned URL 발급 API 경로로 수정 필요
    { fileName, contentType },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const uploadFileToS3 = async (presignedUrl: string, file: File) => {
  await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });
};

export interface UploadMetadataRequest {
  assignmentId: number;
  fileName: string;
  s3Key: string;
  fileType: string;
  uploadAt: string;
}

export const submitUploadMetadata = async (
  data: UploadMetadataRequest,
  token: string
): Promise<uploadApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return uploadMock;
  }

  const response = await axiosInstance.post<uploadApiResponse>(
    `api/submit/upload`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
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
    `api/submit/analyze`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
