import {
  compareApiResponse,
  graphApiResponse,
  judgeApiResponse,
  saveApiResponse,
  topologyApiResponse,
} from 'types/result';
import axiosInstance from './axiosInstance';

/// 유사도 분석 결과 그래프

export interface fetchGraphRequest {
  assignmentId: number;
  weekTitle: number;
}

export const fetchGraph = async (
  { assignmentId, weekTitle }: fetchGraphRequest,
  token: string
) => {
  const response = await axiosInstance.get<graphApiResponse>(
    `api/result/graph`,
    {
      params: { assignmentId, weekTitle },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

/// 유사도 네트워크 토폴로지

export const fetchTopology = async (
  { assignmentId, weekTitle }: fetchGraphRequest,
  token: string
) => {
  const response = await axiosInstance.get<topologyApiResponse>(
    `api/result/topology`,
    {
      params: { assignmentId, weekTitle },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

/// 유사도 코드 비교

export interface compareRequest {
  student1: string;
  student2: string;
}

export const fetchCompare = async (
  { student1, student2 }: compareRequest,
  token: string
) => {
  const response = await axiosInstance.get<compareApiResponse>(
    `api/result/compare`,
    {
      params: { student1, student2 },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

/// 표절 판단

export const fetchJudge = async (
  { student1, student2 }: compareRequest,
  token: string
) => {
  const response = await axiosInstance.get<judgeApiResponse>(
    `api/result/judge`,
    {
      params: { student1, student2 },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

/// 결과 저장

export interface saveStudent {
  id: string;
  name: string;
  submittedTime: string;
}

export interface saveRequest {
  userId: string;
  plagiarize: boolean;
  student1: saveStudent;
  student2: saveStudent;
}

export const save = async (
  { userId, plagiarize, student1, student2 }: saveRequest,
  token: string
) => {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('plagiarize', String(plagiarize));
  formData.append('student1', String(student1));
  formData.append('student2', String(student2));

  const response = await axiosInstance.post<saveApiResponse>(
    `api/result/save`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
