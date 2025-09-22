// SavedRecordDetailPage.tsx
import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useRecord } from '@hooks/useRecord';
import SimilarityGraph from '@features/Result/SimilarityGraph';
import type { FileNode, FileEdge } from 'types/similarity';
import { ErrorState, LoadingSkeleton } from '@components/LoadingState';
import { useSubjectStore } from '@stores/useSubjectStore';
import { useSelectedFileStore } from '@stores/useSelectedFileStore';

const THRESHOLD = 80;

function parseISO(s?: string) {
  const d = s ? new Date(s) : null;
  return d && !isNaN(+d) ? d : null;
}

// ✅ KST 기준 사용자 친화적 포맷: YYYY-MM-DD HH:mm
function formatKST(iso?: string) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(+d)) return iso;
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';
  const y = get('year');
  const m = get('month');
  const day = get('day');
  const h = get('hour');
  const min = get('minute');
  return `${y}-${m}-${day} ${h}:${min}`;
}

const SavedRecordDetailPage: React.FC = () => {
  const nav = useNavigate();
  const { subjectId: subjectIdParam, recordId } = useParams<{
    subjectId: string;
    recordId: string;
  }>();

  const subjectId = Number(subjectIdParam);
  const subjectIdValid = Number.isFinite(subjectId);
  const week = useMemo(() => Number(recordId), [recordId]);

  const { selectedSubject } = useSubjectStore();
  const subjectName =
    selectedSubject?.subjectId === subjectId
      ? (selectedSubject.subjectName ?? '')
      : '';

  const { data, isLoading, isError } = useRecord(
    subjectIdValid ? subjectId : undefined
  );

  // ----- 그래프 데이터 구성 (해당 주차 전체) -----
  const { nodes, edges, summary } = useMemo(() => {
    if (!data || !Number.isFinite(week)) {
      return {
        nodes: [] as FileNode[],
        edges: [] as FileEdge[],
        summary: null as null | { pairs: number; max: number; avg: number },
      };
    }

    const labelById = new Map<string, string>();
    for (const n of data.nodes ?? [])
      labelById.set(String(n.id), n.label ?? String(n.id));

    const weekItem = (data.edges ?? []).find(
      (e) => Number(e.week) === Number(week)
    );
    const raw = weekItem?.data ?? [];

    // 제출시간 수집(노드별 가장 이른 시각)
    const submittedByNode = new Map<string, string>();
    const setEarliest = (id: string, iso?: string) => {
      if (!iso) return;
      const prev = submittedByNode.get(id);
      if (!prev) {
        submittedByNode.set(id, iso);
        return;
      }
      const a = parseISO(prev),
        b = parseISO(iso);
      if (a && b && b.getTime() < a.getTime()) submittedByNode.set(id, iso);
    };

    const idSet = new Set<string>();
    for (const d of raw) {
      const f = String(d.from),
        t = String(d.to);
      idSet.add(f);
      idSet.add(t);
      setEarliest(f, d.submittedFrom);
      setEarliest(t, d.submittedTo);
    }

    const nodes: FileNode[] = Array.from(idSet).map((id) => ({
      id,
      label: labelById.get(id) ?? id,
      submittedAt: submittedByNode.get(id) ?? '-', // 저장은 ISO/문자열 원본
    }));

    const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
    const edges: FileEdge[] = raw.map((d) => ({
      from: String(d.from),
      to: String(d.to),
      similarity: Math.round(clamp01(Number(d.value) || 0) * 100),
    }));

    const vals = raw.map((d) => clamp01(Number(d.value) || 0));
    const pairs = vals.length;
    const max = Math.round((pairs ? Math.max(...vals) : 0) * 100);
    const avg = Math.round(
      (pairs ? vals.reduce((a, b) => a + b, 0) / pairs : 0) * 100
    );

    return { nodes, edges, summary: { pairs, max, avg } };
  }, [data, week]);

  // ----- 파일 맵 & 상호작용 상태 -----
  const fileMap = useMemo(() => {
    const m = new Map<
      string,
      { id: string; label: string; submittedAt: string }
    >();
    for (const n of nodes)
      m.set(String(n.id), {
        id: String(n.id),
        label: n.label,
        submittedAt: n.submittedAt,
      });
    return m;
  }, [nodes]);

  const [hoverInfo, setHoverInfo] = useState<string | null>(null);

  // KPI (훅은 early return들보다 위에 위치)
  const kpi = useMemo(() => {
    const totalFiles = nodes.length;
    const pairCount = edges.length;
    const flaggedPairs = edges.filter((e) => e.similarity >= THRESHOLD).length;
    return { totalFiles, pairCount, flaggedPairs };
  }, [nodes, edges]);

  // ----- 상태 처리 -----
  if (!subjectIdValid) return <ErrorState />;
  if (isLoading) return <LoadingSkeleton />;
  if (isError || !data) return <ErrorState />;
  if (!Number.isFinite(week)) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-6 py-12">
          <Text variant="h3" weight="bold" className="text-gray-900">
            잘못된 경로입니다.
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
  if (!edges.length) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-6 py-12">
          <Text variant="h3" weight="bold" className="text-gray-900">
            {week}주차 기록이 없습니다.
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
            &lt;{subjectName}&gt; · {week}주차
          </Text>
        </div>

        {/* KPI */}
        {summary && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <Text variant="caption" color="muted">
                총 파일 수
              </Text>
              <Text variant="h3" weight="bold" className="mt-1 text-gray-900">
                {kpi.totalFiles}
              </Text>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <Text variant="caption" color="muted">
                유사 쌍 수
              </Text>
              <Text variant="h3" weight="bold" className="mt-1 text-gray-900">
                {kpi.pairCount}
              </Text>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <Text variant="caption" color="muted">
                기준 초과 쌍
              </Text>
              <Text variant="h3" weight="bold" className="mt-1 text-red-600">
                {kpi.flaggedPairs}
              </Text>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <Text variant="caption" color="muted">
                최대/평균 유사도
              </Text>
              <Text variant="h3" weight="bold" className="mt-1 text-blue-700">
                {summary.max}% / {summary.avg}%
              </Text>
            </div>
          </div>
        )}

        {/* 그래프 (단일 컬럼로 깔끔하게) */}
        <div className="mb-8">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <Text variant="h3" weight="bold">
                {week}주차 네트워크 토폴로지
              </Text>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500" />{' '}
                  매우 높음
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />{' '}
                  높음
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />{' '}
                  중간
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />{' '}
                  낮음
                </span>
              </div>
            </div>

            <SimilarityGraph
              nodes={nodes}
              edges={edges}
              variant="full"
              height={520}
              interactionOptions={{
                zoomView: false,
                dragView: false,
                dragNodes: false,
              }}
              onNodeHover={(node) => {
                const connectedFiles = edges
                  .filter((e) => e.from === node.id || e.to === node.id)
                  .map((e) =>
                    nodes.find(
                      (n) => n.id === (e.from === node.id ? e.to : e.from)
                    )
                  )
                  .filter((n): n is FileNode => Boolean(n));
                setHoverInfo(
                  [
                    `📄 파일명: ${node.label}`,
                    `🕒 제출 시간: ${formatKST(node.submittedAt)}`,
                    '',
                    `🔗 연결된 유사 파일:`,
                    ...connectedFiles.map((n) => `• ${n.label}`),
                  ].join('\n')
                );
              }}
              onEdgeHover={(edge) => {
                const from = nodes.find((n) => n.id === edge.from);
                const to = nodes.find((n) => n.id === edge.to);
                if (from && to) {
                  setHoverInfo(
                    `🔗 유사도: ${edge.similarity}%\n` +
                      `📁 ${from.label} - ${to.label}\n` +
                      `🕒 ${formatKST(from.submittedAt)} / ${formatKST(to.submittedAt)}`
                  );
                }
              }}
              onEdgeClick={(edge) => {
                const a = fileMap.get(String(edge.from));
                const b = fileMap.get(String(edge.to));
                if (a && b) {
                  // 비교 화면에서 사용할 최소 필드만 설정
                  useSelectedFileStore.getState().setSelectedFiles(
                    {
                      id: a.id,
                      label: a.label,
                      submittedAt: a.submittedAt,
                      content: [],
                      similarMap: {},
                    },
                    {
                      id: b.id,
                      label: b.label,
                      submittedAt: b.submittedAt,
                      content: [],
                      similarMap: {},
                    }
                  );
                  nav(`/compare/${String(a.id)}/${String(b.id)}`);
                }
              }}
            />

            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800">
              {hoverInfo ? (
                hoverInfo
                  .split('\n')
                  .map((line, idx) => <p key={idx}>{line}</p>)
              ) : (
                <Text variant="caption" color="muted">
                  그래프에서 노드 또는 엣지를 호버/클릭하면 상세 정보가 여기에
                  표시됩니다.
                </Text>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            text="대시보드로 이동"
            variant="secondary"
            size="lg"
            onClick={() => nav('/dashboard')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SavedRecordDetailPage;
