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
import type { PairAnalysisRecord } from './SavedAnalysisType';
import { useSubjectStore } from '@stores/useSubjectStore';
import { buildSavedRecords } from '@utils/savedRecord.utils';

const SavedRecordDetailPage: React.FC = () => {
  const nav = useNavigate();
  const { subjectId: subjectIdParam, recordId } = useParams<{
    subjectId: string;
    recordId: string;
  }>();

  const recordIdKey = useMemo(() => {
    if (!recordId) return undefined;
    try {
      return decodeURIComponent(recordId);
    } catch {
      return recordId; // 이미 디코딩 되었거나 잘못된 인코딩인 경우 원본 사용
    }
  }, [recordId]);

  const subjectId = Number(subjectIdParam);
  const subjectIdValid = Number.isFinite(subjectId);

  // 과목명 표시
  const { selectedSubject } = useSubjectStore();
  const subjectName = selectedSubject?.subjectName ?? '';

  // 과목 id가 유효할 때만 조회
  const { data, isLoading, isError } = useRecord(
    subjectIdValid ? subjectId : undefined
  );

  // API 응답 → 화면 모델로 변환 후 recordId 대상 찾기
  const all = useMemo(
    () => buildSavedRecords(data, subjectName),
    [data, subjectName]
  );

  const rec = useMemo<PairAnalysisRecord | undefined>(() => {
    if (!recordIdKey) return undefined;
    const found = all.find((r) => r.id === recordIdKey);
    return found?.type === 'pair' ? (found as PairAnalysisRecord) : undefined;
  }, [all, recordIdKey]);

  // 그래프 데이터(해당 주차만, 동일 페어는 최대 유사도 1개로)
  const { nodes, edges } = useMemo(() => {
    if (!data || !rec)
      return { nodes: [] as FileNode[], edges: [] as FileEdge[] };

    const labelById = new Map<string, string>();
    for (const n of data.nodes ?? [])
      labelById.set(String(n.id), n.label ?? String(n.id));

    const weekItem = (data.edges ?? []).find(
      (e) => Number(e.week) === Number(rec.week)
    );
    const raw = weekItem?.data ?? [];

    // nodes
    const idSet = new Set<string>();
    for (const d of raw) {
      idSet.add(String(d.from));
      idSet.add(String(d.to));
    }
    const nodes: FileNode[] = Array.from(idSet).map((id) => ({
      id,
      label: labelById.get(id) ?? id,
      submittedAt: '', // 주차 전체 그래프에서는 시간 미표시
    }));

    // edges (동일 페어 병합)
    const edgeMap = new Map<string, FileEdge>();
    for (const d of raw) {
      const a = String(d.from),
        b = String(d.to);
      const [x, y] = a <= b ? [a, b] : [b, a];
      const ratio = Number.isFinite(Number(d.value)) ? Number(d.value) : 0;
      const sim = Math.round(Math.max(0, Math.min(1, ratio)) * 100);
      const key = `${x}-${y}`;
      const prev = edgeMap.get(key);
      if (!prev || sim > prev.similarity)
        edgeMap.set(key, { from: x, to: y, similarity: sim });
    }

    return { nodes, edges: Array.from(edgeMap.values()) };
  }, [data, rec]);

  // 선택된 쌍 강조
  const highlightedEdges = useMemo<FileEdge[]>(() => {
    if (!rec) return edges;
    const a = String(rec.fileA.id),
      b = String(rec.fileB.id);
    return edges.map((e) =>
      (e.from === a && e.to === b) || (e.from === b && e.to === a)
        ? { ...e, similarity: Math.min(100, e.similarity + 3) }
        : e
    );
  }, [edges, rec]);

  // 상태 처리
  if (!subjectIdValid) return <ErrorState />;
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
              nav(`/compare/${String(rec.fileA.id)}/${String(rec.fileB.id)}`)
            }
          />
        </div>
      </div>
    </Layout>
  );
};

export default SavedRecordDetailPage;
