import { saveApiResponse, topologyResponseData } from 'types/result';
import axiosInstance from './axiosInstance';
import { topologyMock } from '@mocks/topologyMock';
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
      import('types/result').graphRawMessage
    >(`/api/result/graph`, {
      params: { assignmentId, week },
    });

    const raw = response.data;

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
export const fetchTopology = async ({
  assignmentId,
  week,
}: fetchGraphRequest): Promise<topologyResponseData> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    // 목이 래핑되어 있다면 여기서 message를 꺼내서 맞춰주세요.
    // return topologyMock.message;
    return (topologyMock as unknown as { message: topologyResponseData })
      .message;
  }

  try {
    const response = await axiosInstance.get<topologyResponseData>(
      `/api/result/topology`,
      { params: { assignmentId, week } }
    );
    return response.data; // ← 래핑 없음 그대로
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

const normalizePair = (
  a: string | number,
  b: string | number
): { from: string | number; to: string | number; swapped: boolean } => {
  // 숫자 비교 우선, 실패 시 문자열 비교
  const aNum = Number(a);
  const bNum = Number(b);

  if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
    if (aNum <= bNum) return { from: a, to: b, swapped: false };
    return { from: b, to: a, swapped: true };
  }

  const aStr = String(a);
  const bStr = String(b);
  if (aStr <= bStr) return { from: a, to: b, swapped: false };
  return { from: b, to: a, swapped: true };
};

export const fetchCompare = async ({
  assignmentId,
  week,
  studentFromId,
  studentToId,
}: compareRequest): Promise<import('types/result').compareResponseData> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    const mock = (await import('@mocks/compareMock'))
      .compareMock as import('types/result').compareRawResponse;
    const raw = mock as unknown as import('types/result').compareRawResponse;
    return {
      student1: toCompareStudent(raw.student1),
      student2: toCompareStudent(raw.student2),
    };
  }

  // ✅ 여기서부터 정렬 보장: studentFromId < studentToId
  const { from, to, swapped } = normalizePair(studentFromId, studentToId);

  try {
    const url = `/api/result/assignments/${assignmentId}/compare`;
    const response = await axiosInstance.get<
      import('types/result').compareRawResponse
    >(url, {
      params: { studentFromId: from, studentToId: to, week },
    });

    const raw = response.data;

    let student1 = toCompareStudent(raw.student1);
    let student2 = toCompareStudent(raw.student2);

    if (swapped) {
      [student1, student2] = [student2, student1];
    }

    return { student1, student2 };
  } catch (error) {
    console.error('fetchCompare error:', error);
    throw error;
  }
};

/// 표절 판단

// judge 요청 파라미터 타입 (compareRequest 재사용 가능하지만 명시적으로 분리해도 OK)
export interface judgeRequest {
  assignmentId: number;
  week: number;
  studentFromId: string | number;
  studentToId: string | number;
}

// judge 호출
export const fetchJudge = async ({
  assignmentId,
  week,
  studentFromId,
  studentToId,
}: judgeRequest): Promise<import('types/result').judgeResponseData> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    const mock = (await import('@mocks/judgeMock'))
      .judgeMock as import('types/result').judgeApiResponse;
    return mock.message;
  }

  // 오타 경로 대비
  const tryOnce = async (fixedPath = false) => {
    const base = fixedPath
      ? '/api/result/assignments'
      : '/api/result/assignmets';
    const url = `${base}/${assignmentId}/judge`;
    const resp = await axiosInstance.get<
      import('types/result').judgeApiResponse
    >(url, {
      params: { studentFromId, studentToId, week },
    });
    return resp;
  };

  try {
    let response: AxiosResponse<import('types/result').judgeApiResponse>;
    try {
      response = await tryOnce(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        response = await tryOnce(true);
      } else {
        throw err;
      }
    }
    return response.data.message;
  } catch (error) {
    console.error('fetchJudge error:', error);
    throw error;
  }
};

/// 표절 판단 결과 저장
export const savePlagiarismResult = async ({
  assignmentId,
  week,
  plagiarize,
  student1,
  student2,
}: import('types/result').saveRequestPayload): Promise<
  import('types/result').saveApiResponse
> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((r) => setTimeout(r, 300));
    return 'OK(MOCK)';
  }

  const tryOnce = (fixedPath = false) => {
    const base = fixedPath
      ? '/api/result/assignments'
      : '/api/result/assignmets';
    const url = `${base}/${assignmentId}/save`;
    return axiosInstance.post<import('types/result').saveApiResponse>(
      url,
      { plagiarize, student1, student2 },
      {
        params: { week },
      }
    );
  };

  try {
    let resp: AxiosResponse<import('types/result').saveApiResponse>;
    try {
      resp = await tryOnce(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        resp = await tryOnce(true);
      } else {
        throw err;
      }
    }
    return resp.data;
  } catch (e) {
    console.error('savePlagiarismResult error:', e);
    throw e;
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
