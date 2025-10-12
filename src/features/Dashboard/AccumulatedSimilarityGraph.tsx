import React, { useEffect, useMemo, useState } from 'react';
import Text from '@components/Text';
import SimilarityGraph from '@features/Result/SimilarityGraph';
import { useSubjectStore } from '@stores/useSubjectStore';
import { ErrorState, LoadingSkeleton } from '@components/LoadingState';
import { useAccumulatedTopology } from '@hooks/useAccumulatedTopology';

type AccNode = { id: string; label: string; submittedAt: string };
type AccEdge = { from: string; to: string; similarity: number; count?: number };

type BandName = 'very' | 'high' | 'mid' | 'low';
const ABS_BANDS = { very: 90, high: 75, mid: 60 } as const;
const GRAPH_HEIGHT = 520;

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\s_\-./\\]+/g, '');

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

const AccumulatedSimilarityGraph: React.FC = () => {
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const { selectedSubject } = useSubjectStore();
  const subjectId = selectedSubject?.subjectId;

  const [showBands, setShowBands] = useState<Record<BandName, boolean>>({
    very: true,
    high: false,
    mid: false,
    low: false,
  });
  const [focusQuery, setFocusQuery] = useState('');
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);

  const { data, isLoading, isError } = useAccumulatedTopology(subjectId);

  const base = useMemo((): { nodes: AccNode[]; edges: AccEdge[] } => {
    if (!data || !subjectId) return { nodes: [], edges: [] };
    const seen = new Set<string>();
    const nodes: AccNode[] = data.nodes.reduce<AccNode[]>((acc, n) => {
      const id = `${subjectId}:${String(n.id)}`;
      if (!seen.has(id)) {
        seen.add(id);
        acc.push({ id, label: n.label, submittedAt: '' });
      }
      return acc;
    }, []);
    const edges: AccEdge[] = data.edges.map((e) => ({
      from: `${subjectId}:${String(e.from)}`,
      to: `${subjectId}:${String(e.to)}`,
      similarity: Math.round((e.value ?? 0) * 100),
      count: e.count ?? 1,
    }));
    return { nodes, edges };
  }, [data, subjectId]);

  const normNodes = useMemo(
    () =>
      base.nodes.map((n) => ({
        id: n.id,
        normId: normalize(n.id),
        normLabel: normalize(n.label ?? ''),
      })),
    [base.nodes]
  );

  const quantileCuts = useMemo(() => {
    const sims = base.edges.map((e) => e.similarity).sort((a, b) => a - b);
    return {
      very: Math.round(quantile(sims, 0.9)),
      high: Math.round(quantile(sims, 0.7)),
      mid: Math.round(quantile(sims, 0.4)),
    };
  }, [base.edges]);

  // ✅ 하이브리드 분류
  const edgeToBandHybrid = (sim: number): BandName => {
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

  const filteredEdges = useMemo(() => {
    let es = base.edges.filter(
      (e) => showBands[edgeToBandHybrid(e.similarity)]
    );
    if (focusNodeId)
      es = es.filter((e) => e.from === focusNodeId || e.to === focusNodeId);
    return es;
  }, [base.edges, showBands, focusNodeId, quantileCuts]);

  const filteredNodes = useMemo(() => {
    if (!filteredEdges.length)
      return focusNodeId ? base.nodes.filter((n) => n.id === focusNodeId) : [];
    const keep = new Set<string>();
    filteredEdges.forEach((e) => {
      keep.add(e.from);
      keep.add(e.to);
    });
    if (focusNodeId) keep.add(focusNodeId);
    return base.nodes.filter((n) => keep.has(n.id));
  }, [base.nodes, filteredEdges, focusNodeId]);

  const tableRows = useMemo(() => {
    const agg = new Map<
      string,
      { from: string; to: string; similarity: number; count: number }
    >();
    for (const e of filteredEdges) {
      const [a, b] = e.from <= e.to ? [e.from, e.to] : [e.to, e.from];
      const k = `${a}-${b}`;
      const prev = agg.get(k);
      if (!prev) {
        agg.set(k, {
          from: a,
          to: b,
          similarity: e.similarity,
          count: e.count ?? 0,
        });
      } else {
        prev.count += e.count ?? 0; // 관측 수 합산
        prev.similarity = Math.max(prev.similarity, e.similarity); // 대표 유사도는 최고값
      }
    }
    return Array.from(agg.values())
      .filter((r) => r.count >= 2)
      .sort((x, y) => y.count - x.count || y.similarity - x.similarity);
  }, [filteredEdges]);

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-10">
      {/* 그래프 카드 */}
      <div className="col-span-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 lg:col-span-6">
        {/* 컨트롤 바 (드롭다운 없이 하이브리드 라벨) */}
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

        <div className="mb-3 flex items-center justify-between">
          <Text variant="h3" weight="bold" className="text-gray-900">
            전체 네트워크
          </Text>
        </div>

        <SimilarityGraph
          nodes={filteredNodes.length ? filteredNodes : base.nodes}
          edges={filteredEdges.length ? filteredEdges : base.edges}
          height={GRAPH_HEIGHT}
          interactionOptions={{
            zoomView: false,
            dragView: false,
            dragNodes: false,
          }}
          onNodeHover={(node) => {
            const connected = (
              filteredEdges.length ? filteredEdges : base.edges
            ).filter((e) => e.from === node.id || e.to === node.id);
            const connectedNames = connected
              .map((e) => {
                const otherId = e.from === node.id ? e.to : e.from;
                const other = (
                  filteredNodes.length ? filteredNodes : base.nodes
                ).find((n) => n.id === otherId);
                return other?.label ?? otherId;
              })
              .filter(Boolean) as string[];
            setHoverInfo(
              [
                '📄 학생명: ' + node.label,
                '',
                ...connectedNames.map((n) => `• ${n}`),
              ].join('\n')
            );
          }}
          onEdgeHover={(edge) => {
            const from = (
              filteredNodes.length ? filteredNodes : base.nodes
            ).find((n) => n.id === edge.from);
            const to = (filteredNodes.length ? filteredNodes : base.nodes).find(
              (n) => n.id === edge.to
            );
            const c =
              (filteredEdges.length ? filteredEdges : base.edges).find(
                (e) => e.from === edge.from && e.to === edge.to
              )?.count ?? 1;
            setHoverInfo(
              `👥 ${from?.label} ↔ ${to?.label}\n유사도: ${edge.similarity}%\n관측: ${c}회`
            );
          }}
        />

        {hoverInfo && (
          <div className="mt-4 whitespace-pre-line rounded-lg border border-blue-100 bg-blue-50 p-3 text-blue-800">
            {hoverInfo}
          </div>
        )}
      </div>

      {/* 요약 표 (기존 그대로) */}
      <div className="col-span-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 lg:col-span-4">
        <Text variant="body" weight="bold" className="mb-3 border-b pb-2">
          2회 이상 높은 유사도 관측 학생 쌍
        </Text>
        <div
          className="relative overflow-y-auto rounded-lg border"
          style={{ maxHeight: GRAPH_HEIGHT }}
        >
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-white text-gray-600 shadow-sm border-b">
              <tr>
                <th className="px-3 py-2">학생 쌍</th>
                <th className="px-3 py-2">유사도</th>
                <th className="px-3 py-2">관측</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((e) => (
                <tr key={`${e.from}-${e.to}`} className="border-t bg-white">
                  <td className="px-3 py-2">
                    {base.nodes.find((n) => n.id === e.from)?.label ?? e.from}{' '}
                    ↔ {base.nodes.find((n) => n.id === e.to)?.label ?? e.to}
                  </td>
                  <td className="px-3 py-2 font-semibold text-red-600">
                    {e.similarity}%
                  </td>
                  <td className="px-3 py-2 font-semibold text-blue-700">
                    {e.count ?? 1}회
                  </td>
                </tr>
              ))}
              {tableRows.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-6 text-center text-gray-500"
                    colSpan={3}
                  >
                    조건을 만족하는 쌍이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccumulatedSimilarityGraph;
