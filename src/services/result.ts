import { saveApiResponse, topologyResponseData } from 'types/result';
import axiosInstance from './axiosInstance';

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
  try {
    const response = await axiosInstance.get<
      import('types/result').graphRawMessage
    >('/api/result/graph', { params: { assignmentId, week } });

    const raw = response.data;

    const nodes = raw.nodes.map((n) => ({
      id: String(n.id),
      label: n.label,
    }));

    const summary = {
      total: raw.filterSummary.total,
      aboveThreshold: raw.filterSummary.aboveThreshold,
      belowThreshold: raw.filterSummary.belowThreshold,
      threshold: toPct(raw.filterSummary.threshold),
    };

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

/// 유사도 네트워크 토폴로지 (항상 실서버)
export const fetchTopology = async ({
  assignmentId,
  week,
}: fetchGraphRequest): Promise<topologyResponseData> => {
  try {
    const response = await axiosInstance.get<topologyResponseData>(
      '/api/result/topology',
      { params: { assignmentId, week } }
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

const normalizePair = (
  a: string | number,
  b: string | number
): { from: string | number; to: string | number; swapped: boolean } => {
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
  const { from, to, swapped } = normalizePair(studentFromId, studentToId);

  try {
    const url = `/api/result/assignments/${assignmentId}/compare`; // ✅ assignments 고정
    const response = await axiosInstance.get<
      import('types/result').compareRawResponse
    >(url, { params: { studentFromId: from, studentToId: to, week } });

    const raw = response.data;
    let student1 = toCompareStudent(raw.student1);
    let student2 = toCompareStudent(raw.student2);
    if (swapped) [student1, student2] = [student2, student1];

    return { student1, student2 };
  } catch (error) {
    console.error('fetchCompare error:', error);
    throw error;
  }
};

/// 표절 판단
export interface judgeRequest {
  assignmentId: number;
  week: number;
  studentFromId: string | number;
  studentToId: string | number;
}

export const fetchJudge = async ({
  assignmentId,
  week,
  studentFromId,
  studentToId,
}: judgeRequest): Promise<import('types/result').judgeResponseData> => {
  try {
    const url = `/api/result/assignments/${assignmentId}/judge`;
    const response = await axiosInstance.get<
      import('types/result').judgeResponseData
    >(url, { params: { studentFromId, studentToId, week } });

    return response.data; // ✅ message 꺼내지 말고 바로 반환
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
  try {
    const url = `/api/result/assignments/${assignmentId}/save`; // ✅ assignments 고정
    const resp = await axiosInstance.post<
      import('types/result').saveApiResponse
    >(url, { plagiarize, student1, student2 }, { params: { week } });
    return resp.data;
  } catch (e) {
    console.error('savePlagiarismResult error:', e);
    throw e;
  }
};

/// 결과 저장 (폼)
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
  try {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('plagiarize', String(plagiarize));
    formData.append('student1', JSON.stringify(student1));
    formData.append('student2', JSON.stringify(student2));

    const response = await axiosInstance.post<saveApiResponse>(
      '/api/result/save',
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('save result error:', error);
    throw error;
  }
};
