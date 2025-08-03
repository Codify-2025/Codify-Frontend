import {
  AccumulatedApiResponse,
  MainApiResponse,
  RecordApiResponse,
} from 'types/dashboard';
import axiosInstance from './axiosInstance';
import { accumulatedMock } from '@mocks/accumulatedMock';
import { recordMock } from '@mocks/recordMock';
import { mainMock } from '@mocks/mainMock';

/// 누적 네트워크 토폴로지

export const fetchAccumulatedTopology = async (
  assignmentName: string,
  token: string
): Promise<AccumulatedApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return accumulatedMock;
  }

  const response = await axiosInstance.get<AccumulatedApiResponse>(
    `/api/dashboard/accumulate`,
    {
      params: { assignmentName },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

/// 저장된 분석 기록

export const fetchRecord = async (
  token: string
): Promise<RecordApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return recordMock;
  }

  const response = await axiosInstance.get<RecordApiResponse>(
    `api/dashboard/record`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

/// 대시보드 메인

export const fetchMain = async (token: string): Promise<MainApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return mainMock;
  }

  const response = await axiosInstance.get<MainApiResponse>(
    `api/dashboard/main`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
