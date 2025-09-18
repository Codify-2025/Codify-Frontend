import {
  compareApiResponse,
  judgeApiResponse,
  saveApiResponse,
  topologyApiResponse,
} from 'types/result';
import axiosInstance from './axiosInstance';
import { topologyMock } from '@mocks/topologyMock';
import { compareMock } from '@mocks/compareMock';
import { judgeMock } from '@mocks/judgeMock';
import { saveMock } from '@mocks/saveMock';

/// 유사도 분석 결과 그래프
export interface fetchGraphRequest {
  assignmentId: number;
  week: number;
}

const toPct = (v: number) => Math.round(v * 100);

export const fetchGraph = async ({
  assignmentId,
  week,
}: fetchGraphRequest): Promise<import('types/result').graphMapped> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
  }

  try {
    const response = await axiosInstance.get<
      import('types/result').graphApiResponse
    >(`/api/result/graph`, {
      params: { assignmentId, week },
    });

    const raw = response.data.message;

    // nodes 매핑 (id -> string)
    const nodes = raw.nodes.map((n) => ({
      id: String(n.id),
      label: n.label,
    }));

    // threshold 0~1 → %
    const summary = {
      total: raw.filterSummary.total,
      aboveThreshold: raw.filterSummary.aboveThreshold,
      belowThreshold: raw.filterSummary.belowThreshold,
      threshold: toPct(raw.filterSummary.threshold),
    };

    // pairs 매핑 (fromId/toId → string, similarity → %)
    const mapPairs = (arr: import('types/result').graphRawPairItem[]) =>
      arr.map((p) => ({
        from: String(p.fromId),
        to: String(p.toId),
        similarity: toPct(p.similarity),
      }));

    const pairs = {
      aboveThreshold: mapPairs(raw.filterPairs.aboveThreshold),
      belowThreshold: mapPairs(raw.filterPairs.belowThreshold),
    };

    return { nodes, summary, pairs };
  } catch (error) {
    console.error('fetchGraph error:', error);
    throw error;
  }
};

/// 유사도 네트워크 토폴로지
export const fetchTopology = async (
  { assignmentId, week }: fetchGraphRequest,
  token: string
): Promise<topologyApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return topologyMock;
  }

  try {
    const response = await axiosInstance.get<topologyApiResponse>(
      `/api/result/topology`,
      {
        params: { assignmentId, week },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('fetchTopology error:', error);
    throw error;
  }
};

/// 유사도 코드 비교
export interface compareRequest {
  student1: string;
  student2: string;
}

export const fetchCompare = async (
  { student1, student2 }: compareRequest,
  token: string
): Promise<compareApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return compareMock;
  }

  try {
    const response = await axiosInstance.get<compareApiResponse>(
      `/api/result/compare`,
      {
        params: { student1, student2 },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('fetchCompare error:', error);
    throw error;
  }
};

/// 표절 판단
export const fetchJudge = async (
  { student1, student2 }: compareRequest,
  token: string
): Promise<judgeApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return judgeMock;
  }

  try {
    const response = await axiosInstance.get<judgeApiResponse>(
      `/api/result/judge`,
      {
        params: { student1, student2 },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('fetchJudge error:', error);
    throw error;
  }
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
): Promise<saveApiResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return saveMock;
  }

  try {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('plagiarize', String(plagiarize));
    formData.append('student1', JSON.stringify(student1));
    formData.append('student2', JSON.stringify(student2));

    const response = await axiosInstance.post<saveApiResponse>(
      `/api/result/save`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('save result error:', error);
    throw error;
  }
};
