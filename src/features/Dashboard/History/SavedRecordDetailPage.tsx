import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useRecord } from '@hooks/useRecord';
import SimilarityGraph from '@features/Result/SimilarityGraph';
import type { FileNode, FileEdge } from 'types/similarity';
import { ErrorState, LoadingSkeleton } from '@components/LoadingState';
import { useSubjectStore } from '@stores/useSubjectStore';

const THRESHOLD = 80;
type BandName = 'very' | 'high' | 'mid' | 'low';

const ABS_BANDS = { very: 90, high: 75, mid: 60 } as const;

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined)
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  return sorted[base];
}

const GRAPH_HEIGHT = 520;

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\s_\-./\\]+/g, '');

function parseISO(s?: string) {
  const d = s ? new Date(s) : null;
  return d && !isNaN(+d) ? d : null;
}
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
  const get = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
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

  // ✅ 누락됐던 hoverInfo state 추가
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);

  // ===== 그래프 원본 만들기
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

    const submittedByNode = new Map<string, string>();
    const setEarliest = (id: string, iso?: string) => {
      if (!iso) return;
      const prev = submittedByNode.get(id);
      if (!prev) return void submittedByNode.set(id, iso);
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
      submittedAt: submittedByNode.get(id) ?? '-',
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

  // KPI
  const kpi = useMemo(() => {
    const totalFiles = nodes.length;
    const pairCount = edges.length;
    const flaggedPairs = edges.filter((e) => e.similarity >= THRESHOLD).length;
    return { totalFiles, pairCount, flaggedPairs };
  }, [nodes, edges]);

  // ===== 구간 필터 & 검색
  const [showBands, setShowBands] = useState<Record<BandName, boolean>>({
    very: true,
    high: false,
    mid: false,
    low: false,
  });
  const [focusQuery, setFocusQuery] = useState('');
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);

  const normNodes = useMemo(
    () =>
      nodes.map((n) => ({
        id: n.id,
        normId: normalize(n.id),
        normLabel: normalize(n.label ?? ''),
      })),
    [nodes]
  );

  const quantileCuts = useMemo(() => {
    const sims = edges.map((e) => e.similarity).sort((a, b) => a - b);
    return {
      very: Math.round(quantile(sims, 0.9)),
      high: Math.round(quantile(sims, 0.7)),
      mid: Math.round(quantile(sims, 0.4)),
    };
  }, [edges]);

  // 하이브리드 분류
  const edgeToBandHybrid = (sim: number) => {
    const q = quantileCuts;
    if (sim >= ABS_BANDS.very || sim >= q.very) return 'very';
    const isAbsHigh = sim >= ABS_BANDS.high && sim < ABS_BANDS.very;
    const isQHigh = sim >= q.high && sim < q.very;
    if (isAbsHigh || isQHigh) return 'high';
    const isAbsMid = sim >= ABS_BANDS.mid && sim < ABS_BANDS.high;
    const isQMid = sim >= q.mid && sim < q.high;
    if (isAbsMid || isQMid) return 'mid';
    return 'low';
  };

  // 검색 (useEffect로 변경)
  useEffect(() => {
    const raw = focusQuery.trim();
    if (!raw) {
      setFocusNodeId(null);
      return;
    }
    const q = normalize(raw);
    let found = normNodes.find((n) => n.normId === q);
    if (!found) found = normNodes.find((n) => n.normLabel.includes(q));
    setFocusNodeId(found ? found.id : null);
  }, [focusQuery, normNodes]);

  // 필터링
  const filteredEdges = useMemo(() => {
    let es = edges.filter((e) => showBands[edgeToBandHybrid(e.similarity)]);
    if (focusNodeId)
      es = es.filter((e) => e.from === focusNodeId || e.to === focusNodeId);
    return es;
  }, [edges, showBands, focusNodeId, quantileCuts]);

  const filteredNodes = useMemo(() => {
    if (!filteredEdges.length)
      return focusNodeId ? nodes.filter((n) => n.id === focusNodeId) : [];
    const keep = new Set<string>();
    filteredEdges.forEach((e) => {
      keep.add(e.from);
      keep.add(e.to);
    });
    if (focusNodeId) keep.add(focusNodeId);
    return nodes.filter((n) => keep.has(n.id));
  }, [nodes, filteredEdges, focusNodeId]);

  // Top 5
  const topPairs = useMemo(() => {
    return filteredEdges
      .map((e) => {
        const a = nodes.find((n) => n.id === e.from);
        const b = nodes.find((n) => n.id === e.to);
        return a && b ? { ...e, a, b } : null;
      })
      .filter((x): x is FileEdge & { a: FileNode; b: FileNode } => x !== null)
      .sort((x, y) => y.similarity - x.similarity)
      .slice(0, 5);
  }, [filteredEdges, nodes]);

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
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
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

        {/* 컨트롤 바 */}
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {(['very', 'high', 'mid', 'low'] as const).map((k) => (
            <label key={k} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={showBands[k]}
                onChange={(e) =>
                  setShowBands((s) => ({ ...s, [k]: e.target.checked }))
                }
              />
              <span className="inline-flex items-center gap-1">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    k === 'very'
                      ? 'bg-red-500'
                      : k === 'high'
                        ? 'bg-amber-500'
                        : k === 'mid'
                          ? 'bg-blue-500'
                          : 'bg-slate-400'
                  }`}
                />
                {k === 'very'
                  ? '매우 높음 (≥90% 또는 상위 10%)'
                  : k === 'high'
                    ? '높음 (75~90% 또는 상위 10~30%)'
                    : k === 'mid'
                      ? '중간 (60~75% 또는 상위 30~60%)'
                      : '낮음 (그 외)'}
              </span>
            </label>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <input
              placeholder="학생명/학번 검색"
              value={focusQuery}
              onChange={(e) => setFocusQuery(e.target.value)}
              className="rounded border px-2 py-1 text-sm"
            />
            {focusNodeId && (
              <button
                className="text-xs text-blue-600 underline"
                onClick={() => setFocusNodeId(null)}
              >
                전체 보기
              </button>
            )}
          </div>
        </div>

        {/* 그래프 + Top5 */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
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
              nodes={filteredNodes.length ? filteredNodes : nodes}
              edges={filteredEdges.length ? filteredEdges : edges}
              variant="full"
              height={GRAPH_HEIGHT}
              interactionOptions={{
                zoomView: false,
                dragView: false,
                dragNodes: false,
              }}
              onNodeHover={(node) => {
                const connectedFiles = (
                  filteredEdges.length ? filteredEdges : edges
                )
                  .filter((e) => e.from === node.id || e.to === node.id)
                  .map((e) =>
                    (filteredNodes.length ? filteredNodes : nodes).find(
                      (n) => n.id === (e.from === node.id ? e.to : e.from)
                    )
                  )
                  .filter((n): n is FileNode => Boolean(n));
                setHoverInfo(
                  [
                    `📄 파일명: ${node.label}`,
                    `🕒 제출 시간: ${formatKST(node.submittedAt)}`,
                    '',
                    '🔗 연결된 유사 파일:',
                    ...connectedFiles.map((n) => `• ${n.label}`),
                  ].join('\n')
                );
              }}
              onEdgeHover={(edge) => {
                const from = (
                  filteredNodes.length ? filteredNodes : nodes
                ).find((n) => n.id === edge.from);
                const to = (filteredNodes.length ? filteredNodes : nodes).find(
                  (n) => n.id === edge.to
                );
                if (from && to) {
                  setHoverInfo(
                    `🔗 유사도: ${edge.similarity}%\n📁 ${from.label} - ${to.label}\n🕒 ${formatKST(from.submittedAt)} / ${formatKST(to.submittedAt)}`
                  );
                }
              }}
            />

            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800">
              {hoverInfo ? (
                hoverInfo
                  .split('\n')
                  .map((l: string, i: number) => <p key={i}>{l}</p>)
              ) : (
                <Text variant="caption" color="muted">
                  그래프에서 노드/엣지를 호버/클릭하면 상세 정보가 여기에
                  표시됩니다.
                </Text>
              )}
            </div>
          </div>

          {/* Top 5 유사쌍 */}
          <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <Text variant="h3" weight="bold" className="mb-3">
              상위 유사 쌍
            </Text>
            {topPairs.length === 0 ? (
              <Text variant="caption" color="muted">
                표시할 쌍이 없습니다.
              </Text>
            ) : (
              <ul className="space-y-2">
                {topPairs.map((p) => {
                  const key = `${p.from}-${p.to}`;
                  const a = nodes.find((n) => n.id === p.from);
                  const b = nodes.find((n) => n.id === p.to);
                  return (
                    <li
                      key={key}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-gray-900">
                          {a?.label ?? p.from}
                          <span className="mx-1 text-gray-400">·</span>
                          {b?.label ?? p.to}
                        </p>
                        <Text variant="caption" color="muted">
                          유사도 {p.similarity}%
                        </Text>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        </div>

        <div className="mt-8 flex justify-end">
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
