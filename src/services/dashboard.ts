// services/dashboard.ts
import {
  AccumulatedResponseData,
  MainResponseData,
  RecordResponseData,
} from 'types/dashboard';
import axiosInstance from './axiosInstance';

export const fetchAccumulatedTopology = async (
  subjectId: number
): Promise<AccumulatedResponseData> => {
  const response = await axiosInstance.get<AccumulatedResponseData>(
    `/api/dashboard/accumulate`,
    { params: { subjectId } }
  );
  return response.data;
};

export const fetchRecord = async (
  subjectId: number
): Promise<RecordResponseData> => {
  // ✅ 항상 실서버 호출
  const response = await axiosInstance.get<RecordResponseData>(
    `/api/dashboard/record`,
    { params: { subjectId } }
  );
  return response.data;
};

export const fetchMain = async (): Promise<MainResponseData> => {
  const response =
    await axiosInstance.get<MainResponseData>(`/api/dashboard/main`);
  return response.data;
};
