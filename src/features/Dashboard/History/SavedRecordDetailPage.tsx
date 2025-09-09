import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useRecord } from '@hooks/useRecord';
import SimilarityGraph from '@features/Result/SimilarityGraph';
import type { FileNode, FileEdge } from 'types/similarity';
import { formatDateTimeKST, formatPercent01 } from '@utils/format';
import { ErrorState, LoadingSkeleton } from '@components/LoadingState';
import { useSubjectStore } from '@stores/useSubjectStore';
import type {
  SavedAnalysisRecord,
  PairAnalysisRecord,
} from './SavedAnalysisType';

const SavedRecordDetailPage: React.FC = () => {
  const nav = useNavigate();
  const { recordId } = useParams<{ recordId: string }>();

  // 현재 선택된 과목 기준으로 기록 API 호출
  const { selectedSubject } = useSubjectStore();
  const subjectId = selectedSubject ? Number(selectedSubject.id) : undefined;
  const { data, isLoading, isError } = useRecord(subjectId);

  // API 응답 -> SavedAnalysisRecord 리스트로 어댑트 후, URL의 recordId로 대상 찾기
  const rec = useMemo<PairAnalysisRecord | undefined>(() => {
    if (!data || !recordId) return undefined;

    // id -> label 매핑
    const nameMap = new Map<string, string>();
    for (const n of data.nodes ?? []) {
      nameMap.set(String(n.id), n.label ?? String(n.id));
    }

    // edges를 화면 모델로 변환
    const records: SavedAnalysisRecord[] = [];
    for (const e of data.edges ?? []) {
      const week = Number(e.week) || 0;
      for (const d of e.data ?? []) {
        const fromId = String(d.from);
        const toId = String(d.to);
        const savedAt =
          d.submittedTo ?? d.submittedFrom ?? new Date().toISOString();
        const id = d.id ?? `${week}-${fromId}-${toId}-${savedAt}`;

        records.push({
          id,
          type: 'pair',
          assignmentName: selectedSubject?.name ?? '',
          week,
          savedAt,
          similarity: Math.round(
            (typeof d.value === 'number' ? d.value : 0) * 100
          ),
          fileA: {
            id: fromId,
            label: nameMap.get(fromId) ?? fromId,
            submittedAt: d.submittedFrom ?? savedAt,
          },
          fileB: {
            id: toId,
            label: nameMap.get(toId) ?? toId,
            submittedAt: d.submittedTo ?? savedAt,
          },
        } as PairAnalysisRecord);
      }
    }

    return records.find((r) => r.id === recordId) as
      | PairAnalysisRecord
      | undefined;
  }, [data, recordId, selectedSubject?.name]);

  // 그래프용 nodes/edges (해당 주차만, 동일 페어는 최대 유사도로 1개)
  const { nodes, edges } = useMemo(() => {
    if (!data || !rec)
      return { nodes: [] as FileNode[], edges: [] as FileEdge[] };

    // id -> label
    const labelById = new Map<string, string>();
    for (const n of data.nodes ?? []) {
      labelById.set(String(n.id), n.label ?? String(n.id));
    }

    // 해당 주차 raw
    const weekItem = (data.edges ?? []).find(
      (e) => Number(e.week) === Number(rec.week)
    );
    const raw = weekItem?.data ?? [];

    // 등장하는 id 수집 → nodes
    const idSet = new Set<string>();
    for (const d of raw) {
      idSet.add(String(d.from));
      idSet.add(String(d.to));
    }
    const nodes: FileNode[] = Array.from(idSet).map((id) => ({
      id,
      label: labelById.get(id) ?? id,
      submittedAt: '', // 주차 전체 그래프에서는 제출시각 노출 X
    }));

    // 동일 페어 병합 (최대 similarity)
    const edgeMap = new Map<string, FileEdge>();
    for (const d of raw) {
      const a = String(d.from);
      const b = String(d.to);
      const [x, y] = a <= b ? [a, b] : [b, a];
      const key = `${x}-${y}`;
      const ratio = Number.isFinite(Number(d.value)) ? Number(d.value) : 0;
      const sim = Math.round(Math.max(0, Math.min(1, ratio)) * 100);
      const prev = edgeMap.get(key);
      if (!prev || sim > prev.similarity)
        edgeMap.set(key, { from: x, to: y, similarity: sim });
    }

    return { nodes, edges: Array.from(edgeMap.values()) };
  }, [data, rec]);

  const highlightedEdges = useMemo<FileEdge[]>(() => {
    if (!rec) return edges;
    const a = String(rec.fileA.id);
    const b = String(rec.fileB.id);
    return edges.map((e) => {
      const isSelected =
        (e.from === a && e.to === b) || (e.from === b && e.to === a);
      return isSelected
        ? { ...e, similarity: Math.min(100, e.similarity + 3) }
        : e;
    });
  }, [edges, rec]);

  // 로딩/에러/레코드 없음 처리
  if (isLoading) return <LoadingSkeleton />;
  if (isError || !data) return <ErrorState />;
  if (!rec) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-6 py-12">
          <Text variant="h3" weight="bold" className="text-gray-900">
            기록을 찾을 수 없어요.
          </Text>
          <Button
            className="mt-6"
            text="뒤로가기"
            variant="primary"
            onClick={() => nav(-1)}
          />
        </div>
      </Layout>
    );
  }

  const simText = formatPercent01(rec.similarity);
  const aTime = formatDateTimeKST(rec.fileA.submittedAt);
  const bTime = formatDateTimeKST(rec.fileB.submittedAt);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-3">
          <Button text="← 뒤로" variant="ghost" onClick={() => nav(-1)} />
        </div>

        <div className="mb-6">
          <Text variant="h2" weight="bold" className="text-gray-900">
            저장된 분석 상세
          </Text>
          <Text variant="caption" color="muted" className="mt-1">
            &lt;{rec.assignmentName}&gt; · {rec.week}주차
          </Text>
        </div>

        {/* 요약 */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <Text variant="caption" color="muted">
              유사도(선택된 쌍)
            </Text>
            <Text variant="h3" weight="bold" className="mt-1 text-blue-700">
              {simText}
            </Text>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <Text variant="caption" color="muted">
              비교 학생
            </Text>
            <Text variant="body" className="mt-1 text-blue-700">
              {rec.fileA.label} · {rec.fileB.label}
            </Text>
          </div>
        </div>

        {/* 제출 시간 */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[rec.fileA, rec.fileB].map((f, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <Text variant="body" weight="bold" className="text-gray-900">
                {i === 0 ? 'Student A' : 'Student B'}
              </Text>
              <div className="mt-2 text-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{f.label}</span>
                  <span className="text-xs text-gray-400">ID: {f.id}</span>
                </div>
                <div className="mt-1 text-sm">
                  제출 시간:{' '}
                  <span className="text-blue-600">
                    {i === 0 ? aTime : bTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 네트워크 토폴로지 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <Text variant="h3" weight="bold" className="text-gray-900">
              해당 주차 네트워크 토폴로지
            </Text>
            <Text variant="caption" color="muted">
              선택된 쌍은 강조되어 표시됩니다.
            </Text>
          </div>
          <SimilarityGraph
            nodes={nodes}
            edges={highlightedEdges}
            interactionOptions={{
              zoomView: false,
              dragView: false,
              dragNodes: false,
            }}
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-end">
          <Button
            text="해당 두 파일 비교로 이동"
            variant="primary"
            onClick={() =>
              nav(`/compare/${String(rec.fileA.id)}/${String(rec.fileB.id)}`, {
                state: { fromSaved: true, recordId: rec.id },
              })
            }
          />
        </div>
      </div>
    </Layout>
  );
};

export default SavedRecordDetailPage;
