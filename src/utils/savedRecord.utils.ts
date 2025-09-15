import type {
  PairAnalysisRecord,
  SavedAnalysisRecord,
} from '@features/Dashboard/History/SavedAnalysisType';

type RecordNode = { id: string | number; label?: string };
type EdgeDatum = {
  id?: string;
  from: string | number;
  to: string | number;
  value?: number | string;
  submittedFrom?: string;
  submittedTo?: string;
};
type RecordEdge = { week?: number | string; data?: EdgeDatum[] };

export type RecordResponse =
  | {
      nodes?: RecordNode[];
      edges?: RecordEdge[];
    }
  | null
  | undefined;

export function buildSavedRecords(
  data: RecordResponse,
  subjectName: string
): SavedAnalysisRecord[] {
  if (!data) return [];

  const nameMap = new Map<string, string>();
  for (const n of data.nodes ?? []) {
    const id = String(n.id);
    nameMap.set(id, n.label ?? id);
  }

  const records: SavedAnalysisRecord[] = [];
  const dupCounter = new Map<string, number>();

  for (const e of data.edges ?? []) {
    const week = Number(e.week) || 0;

    for (const d of e.data ?? []) {
      const fromId = String(d.from);
      const toId = String(d.to);
      const submittedFrom = d.submittedFrom ?? '';
      const submittedTo = d.submittedTo ?? '';

      const baseId = `${week}__${[fromId, toId].sort().join('-')}__${submittedFrom}__${submittedTo}`;
      const next = (dupCounter.get(baseId) ?? 0) + 1;
      dupCounter.set(baseId, next);

      const uniqueId = d.id ?? (next === 1 ? baseId : `${baseId}__${next}`);
      const savedAt = submittedTo || submittedFrom || new Date().toISOString();

      records.push({
        id: uniqueId,
        type: 'pair',
        assignmentName: subjectName,
        week,
        savedAt,
        similarity: Math.min(1, Math.max(0, Number(d.value) || 0)),
        fileA: {
          id: fromId,
          label: nameMap.get(fromId) ?? fromId,
          submittedAt: submittedFrom || savedAt,
        },
        fileB: {
          id: toId,
          label: nameMap.get(toId) ?? toId,
          submittedAt: submittedTo || savedAt,
        },
      } as PairAnalysisRecord);
    }
  }

  return records;
}
