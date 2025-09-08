import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { PairAnalysisRecord, SavedAnalysisRecord } from './SavedAnalysisType';
import { useRecord } from '@hooks/useRecord';
import SimilarityGraph from '@features/Result/SimilarityGraph';
import type { FileNode, FileEdge } from 'types/similarity';
import { formatDateTimeKST, formatPercent01 } from '@utils/format';
import { ErrorState, LoadingSkeleton } from '@components/LoadingState';

function isPair(r: SavedAnalysisRecord | undefined): r is PairAnalysisRecord {
  return !!r && r.type === 'pair';
}

const SavedRecordDetailPage: React.FC = () => {
  const nav = useNavigate();
  const { state } = useLocation() as {
    state?: { record?: SavedAnalysisRecord };
  };
  const rec = state?.record;

  const subjectId = isPair(rec) ? rec.subjectId : undefined;
  const { data, isLoading, isError } = useRecord(subjectId);

  const { nodes, edges } = useMemo(() => {
    if (!data || !isPair(rec))
      return { nodes: [] as FileNode[], edges: [] as FileEdge[] };

    const labelById = new Map<string, string>();
    for (const n of data.nodes ?? [])
      labelById.set(String(n.id), n.label ?? String(n.id));

    const weekItem = (data.edges ?? []).find(
      (e) => Number(e.week) === Number(rec.week)
    );
    const raw = weekItem?.data ?? [];

    // 등장 id 수집 → nodes
    const idSet = new Set<string>();
    for (const d of raw) {
      idSet.add(String(d.from));
      idSet.add(String(d.to));
    }
    const nodes: FileNode[] = Array.from(idSet).map((id) => ({
      id,
      label: labelById.get(id) ?? id,
      submittedAt: '',
    }));

    // 동일 페어 병합 (최대 유사도 선택)
    const edgeMap = new Map<string, FileEdge>();
    for (const d of raw) {
      const a = String(d.from);
      const b = String(d.to);
      const [x, y] = a <= b ? [a, b] : [b, a]; // 정렬된 페어 키
      const key = `${x}-${y}`;
      const sim = Math.round((typeof d.value === 'number' ? d.value : 0) * 100);

      const prev = edgeMap.get(key);
      if (!prev || sim > prev.similarity) {
        edgeMap.set(key, { from: x, to: y, similarity: sim });
      }
    }
    const edges = Array.from(edgeMap.values());
    return { nodes, edges };
  }, [data, rec]);

  const highlightedEdges = useMemo<FileEdge[]>(() => {
    if (!isPair(rec)) return edges;
    const a = String(rec.fileA.id);
    const b = String(rec.fileB.id);
    return edges.map((e) => {
      const isSelectedPair =
        (e.from === a && e.to === b) || (e.from === b && e.to === a);
      return isSelectedPair
        ? { ...e, similarity: Math.min(100, e.similarity + 3) }
        : e;
    });
  }, [edges, rec]);

  if (!isPair(rec)) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-6 py-12">
          <Text variant="h3" weight="bold" className="text-gray-900">
            기록 정보를 찾을 수 없어요.
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

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !data) return <ErrorState />;

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
