// utils/savedRecord.utils.ts
import type {
  SavedAnalysisRecord,
  GroupAnalysisRecord,
} from '@features/Dashboard/History/SavedAnalysisType';

type RecordNode = { id: string | number; label?: string };
type EdgeDatum = {
  id?: string;
  from: string | number;
  to: string | number;
  value?: number | string; // 0~1
  submittedFrom?: string;
  submittedTo?: string;
};
type RecordEdge = { week?: number | string; data?: EdgeDatum[] };

export type RecordResponse =
  | { nodes?: RecordNode[]; edges?: RecordEdge[] }
  | null
  | undefined;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function buildSavedRecords(
  data: RecordResponse,
  subjectName: string
): SavedAnalysisRecord[] {
  if (!data) return [];

  // id -> label
  const labelById = new Map<string, string>();
  for (const n of data.nodes ?? []) {
    const id = String(n.id);
    labelById.set(id, n.label ?? id);
  }

  const groups: GroupAnalysisRecord[] = [];

  for (const e of data.edges ?? []) {
    const week = Number(e.week) || 0;
    const raw = e.data ?? [];

    // 최신 제출 시각 (savedAt)
    let latest = 0;
    for (const d of raw) {
      const t1 = Date.parse(d.submittedFrom ?? '');
      const t2 = Date.parse(d.submittedTo ?? '');
      if (Number.isFinite(t1) && t1 > latest) latest = t1;
      if (Number.isFinite(t2) && t2 > latest) latest = t2;
    }
    const savedAt = latest
      ? new Date(latest).toISOString()
      : new Date().toISOString();

    // 미리보기용 노드/엣지 (상위 K개만)
    const idSet = new Set<string>();
    raw.forEach((d) => {
      idSet.add(String(d.from));
      idSet.add(String(d.to));
    });

    const previewNodes = Array.from(idSet).map((id) => ({
      id,
      label: labelById.get(id) ?? id,
      submittedAt: '', // 미리보기는 시간 비표시
    }));

    // value 내림차순 상위 15개만
    const sortedByValue = [...raw].sort(
      (a, b) => (Number(b.value) || 0) - (Number(a.value) || 0)
    );
    const top = sortedByValue.slice(0, 15);

    const previewEdges = top.map((d) => {
      const ratio = Number(d.value) || 0;
      return {
        from: String(d.from),
        to: String(d.to),
        similarity: Math.round(clamp01(ratio) * 100),
      };
    });

    // 통계
    const sims = raw.map((d) => clamp01(Number(d.value) || 0));
    const pairs = sims.length;
    const maxSim = Math.round((pairs ? Math.max(...sims) : 0) * 100);
    const avgSim = Math.round(
      (pairs ? sims.reduce((a, b) => a + b, 0) / pairs : 0) * 100
    );

    groups.push({
      id: String(week), // 라우트에서 :recordId 로 사용
      subjectId: 0 as unknown as number, // 섹션에서 주입
      assignmentName: subjectName,
      week,
      type: 'group',
      savedAt,
      // ✅ 미리보기/요약
      preview: {
        nodes: previewNodes,
        edges: previewEdges,
        stats: { pairs, maxSim, avgSim },
      },
    });
  }

  return groups;
}
