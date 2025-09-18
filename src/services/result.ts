import {
  judgeApiResponse,
  saveApiResponse,
  topologyApiResponse,
} from 'types/result';
import axiosInstance from './axiosInstance';
import { topologyMock } from '@mocks/topologyMock';
import { judgeMock } from '@mocks/judgeMock';
import { saveMock } from '@mocks/saveMock';
import axios, { AxiosResponse } from 'axios';

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
  assignmentId: number;
  week: number;
  studentFromId: string | number;
  studentToId: string | number;
}

const toCompareStudent = (
  s: import('types/result').compareRawStudent
): import('types/result').compareStudent => ({
  id: s.id,
  name: s.name,
  fileName: s.fileName,
  submissionTime: s.submissionTime,
  code: { code: s.code, lines: s.lines },
});

export const fetchCompare = async ({
  assignmentId,
  week,
  studentFromId,
  studentToId,
}: compareRequest): Promise<import('types/result').compareResponseData> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    const mock = (await import('@mocks/compareMock'))
      .compareMock as import('types/result').compareApiResponse;
    const raw =
      mock.message as unknown as import('types/result').compareRawResponse;
    return {
      student1: toCompareStudent(raw.student1),
      student2: toCompareStudent(raw.student2),
    };
  }

  // 1차: (오타 버전) assignmets
  const tryOnce = async (fixedPath = false) => {
    const base = fixedPath
      ? '/api/result/assignments'
      : '/api/result/assignmets';
    const url = `${base}/${assignmentId}/compare`;
    const resp = await axiosInstance.get<
      import('types/result').compareApiResponse
    >(url, {
      params: { studentFromId, studentToId, week },
    });
    return resp;
  };

  try {
    let response: AxiosResponse<import('types/result').compareApiResponse>;

    try {
      response = await tryOnce(false);
    } catch (err: unknown) {
      // 404면 정식 스펠링으로 재시도
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        response = await tryOnce(true);
      } else {
        throw err; // unknown 그대로 전달
      }
    }

    const raw = response.data
      .message as import('types/result').compareRawResponse;

    return {
      student1: toCompareStudent(raw.student1),
      student2: toCompareStudent(raw.student2),
    };
  } catch (error) {
    console.error('fetchCompare error:', error);
    throw error;
  }
};

/// 표절 판단
export const fetchJudge = async (
  { studentFromId, studentToId }: compareRequest,
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
        params: { studentFromId, studentToId },
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
