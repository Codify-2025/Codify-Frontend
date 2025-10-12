import React, { useEffect, useMemo, useState } from 'react';
import Text from '@components/Text';
import SimilarityGraph from '@features/Result/SimilarityGraph';
import { useSubjectStore } from '@stores/useSubjectStore';
import { ErrorState, LoadingSkeleton } from '@components/LoadingState';
import { useAccumulatedTopology } from '@hooks/useAccumulatedTopology';

// ----- 타입 정의 (any 제거)
type AccNode = { id: string; label: string; submittedAt: string };
type AccEdge = { from: string; to: string; similarity: number; count?: number };

type BandMode = 'absolute' | 'quantile';
type BandName = 'very' | 'high' | 'mid' | 'low';
const ABS_BANDS = { very: 90, high: 75, mid: 60 } as const;
const GRAPH_HEIGHT = 520;

// 공통 정규화
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

  // 구간 필터 & 검색 상태 (기본: 매우 높음만 켬)
  const [bandMode, setBandMode] = useState<BandMode>('absolute');
  const [showBands, setShowBands] = useState<Record<BandName, boolean>>({
    very: true,
    high: false,
    mid: false,
    low: false,
  });
  const [focusQuery, setFocusQuery] = useState('');
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);

  // 서버 데이터 훅
  const { data, isLoading, isError } = useAccumulatedTopology(subjectId);

  // ---- 원본 그래프 변환 (안전하게 비어있는 배열 반환)
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

  // 정규화 노드 캐시
  const normNodes = useMemo(
    () =>
      base.nodes.map((n) => ({
        id: n.id,
        normId: normalize(n.id),
        normLabel: normalize(n.label ?? ''),
      })),
    [base.nodes]
  );

  // 분위수 컷
  const quantileCuts = useMemo(() => {
    const sims = base.edges.map((e) => e.similarity).sort((a, b) => a - b);
    return {
      very: Math.round(quantile(sims, 0.9)),
      high: Math.round(quantile(sims, 0.7)),
      mid: Math.round(quantile(sims, 0.4)),
    };
  }, [base.edges]);

  const edgeToBand = (sim: number): BandName => {
    const cuts = bandMode === 'absolute' ? ABS_BANDS : quantileCuts;
    if (sim >= cuts.very) return 'very';
    if (sim >= cuts.high) return 'high';
    if (sim >= cuts.mid) return 'mid';
    return 'low';
  };

  // 검색 → focusNodeId (useEffect로! 훅 순서 안정)
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
    let es = base.edges.filter((e) => showBands[edgeToBand(e.similarity)]);
    if (focusNodeId)
      es = es.filter((e) => e.from === focusNodeId || e.to === focusNodeId);
    return es;
  }, [base.edges, showBands, bandMode, quantileCuts, focusNodeId]);

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

  // 2회 이상 관측 목록 (필터 반영) — 훅은 early return보다 위!
  const tableRows = useMemo(
    () =>
      filteredEdges
        .filter((e) => (e.count ?? 0) >= 2)
        .sort(
          (a, b) =>
            (b.count ?? 0) - (a.count ?? 0) || b.similarity - a.similarity
        ),
    [filteredEdges]
  );

  // ----- 상태 처리 (모든 훅 정의 이후에 early return 배치) -----
  if (isLoading) return <LoadingSkeleton />;
  if (isError || !data) return <ErrorState />;

  const cuts = bandMode === 'absolute' ? ABS_BANDS : quantileCuts;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-10">
      {/* 그래프 카드 */}
      <div className="col-span-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 lg:col-span-6">
        {/* 컨트롤 바 */}
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <select
            value={bandMode}
            onChange={(e) => setBandMode(e.target.value as BandMode)}
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="absolute">절대 구간</option>
            <option value="quantile">분위수 구간</option>
          </select>

          {(['very', 'high', 'mid', 'low'] as BandName[]).map((k) => (
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
                  ? '매우 높음'
                  : k === 'high'
                    ? '높음'
                    : k === 'mid'
                      ? '중간'
                      : '낮음'}{' '}
                {k === 'low' ? `< ${cuts.mid}%` : `≥ ${cuts[k]}%`}
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
            // ✅ 현재 엣지의 count는 배열에서 검색해서 가져오기 (any 제거)
            const c =
              (filteredEdges.length ? filteredEdges : base.edges).find(
                (e) => e.from === edge.from && e.to === edge.to
              )?.count ?? 1;
            setHoverInfo(
              `👥 ${from?.label} ↔ ${to?.label}\n유사도: ${edge.similarity}%\n관측: ${c}회`
            );
          }}
        />

        {/* Hover 정보 */}
        {hoverInfo && (
          <div className="mt-4 whitespace-pre-line rounded-lg border border-blue-100 bg-blue-50 p-3 text-blue-800">
            {hoverInfo}
          </div>
        )}
      </div>

      {/* 요약 패널: 스크롤 영역 (그래프와 동일 높이) */}
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
