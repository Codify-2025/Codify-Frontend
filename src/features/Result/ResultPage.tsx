import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import SimilarityPieChart from './SimilarityPieChart';
import SimilarityGraph from './SimilarityGraph';
import { useAssignmentStore } from '@stores/useAssignmentStore';
import { useSelectedFileStore } from '@stores/useSelectedFileStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { dummyFiles } from '@constants/dummyFiles';
import { useSavedRecordStore } from '@stores/useSavedRecordStore';
import { useSubjectStore } from '@stores/useSubjectStore';
import { FiChevronRight } from 'react-icons/fi';
import type { FileNode, FileEdge } from 'types/similarity';
import type { FileData as StoreFileData } from '@stores/useSelectedFileStore';
import { useSimilarityGraph } from '@hooks/useSimilarityGraph';
import { useSimilarityTopology } from '@hooks/useSimilarityTopology';

const THRESHOLD = 80;

// 구간 이름
type BandName = 'very' | 'high' | 'mid' | 'low';

// 절대 구간 컷(%) — [very, high, mid]
const ABS_BANDS = { very: 90, high: 75, mid: 60 } as const;

type DummyLike = {
  id: string;
  label: string;
  submittedAt: string;
  content?: unknown;
  similarMap?: unknown;
};

function normalizeToStoreData(list: readonly DummyLike[]): StoreFileData[] {
  return list.map<StoreFileData>((f) => {
    const rawContent = f.content;
    let content: string[] = [];
    if (Array.isArray(rawContent)) {
      content = rawContent.filter((v): v is string => typeof v === 'string');
    } else if (typeof rawContent === 'string') {
      content = [rawContent];
    }

    const map: Record<number, string[]> = {};
    const sm = f.similarMap;
    if (sm && typeof sm === 'object' && !Array.isArray(sm)) {
      for (const [k, v] of Object.entries(sm as Record<string, unknown>)) {
        const numKey = Number(k);
        if (Number.isFinite(numKey)) {
          if (Array.isArray(v)) {
            const arr = v.filter((x): x is string => typeof x === 'string');
            if (arr.length) map[numKey] = arr;
          } else if (typeof v === 'string') {
            map[numKey] = [v];
          }
        }
      }
    }

    return {
      id: f.id,
      label: f.label,
      submittedAt: f.submittedAt,
      content,
      similarMap: map,
    };
  });
}

// 분위수 계산
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

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { name, week, assignmentId } = useAssignmentStore();
  const { selectedSubject } = useSubjectStore();

  const { setFiles, setSelectedFiles } = useSelectedFileStore();

  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  type HoverPair = {
    from: string;
    to: string;
    similarity: number;
    aLabel: string;
    bLabel: string;
  };
  const [hoveredPairs, setHoveredPairs] = useState<HoverPair[]>([]);
  const [activeSegment, setActiveSegment] = useState<
    '기준 이하' | '기준 초과' | null
  >(null);

  // 파이차트 버킷 아이템 형태(백엔드가 similarity 또는 value(0~1)를 줄 수 있음)
  type BucketPair = {
    from: string | number;
    to: string | number;
    similarity?: number; // 0~100 (%)
    value?: number; // 0~1 (ratio)
  };

  // 구간 필터 상태
  const [showBands, setShowBands] = useState<Record<BandName, boolean>>({
    very: true,
    high: true,
    mid: true,
    low: true,
  });

  // 검색 상태
  const [focusQuery, setFocusQuery] = useState('');
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);

  // 파이 클릭 연동(선택): 기준 초과만 보기 토글
  const [showOnlyAboveThreshold, setShowOnlyAboveThreshold] = useState(false);

  const fromSaved: boolean | undefined = (
    location.state as { fromSaved?: boolean } | undefined
  )?.fromSaved;

  useEffect(() => {
    if (fromSaved) return;
    const st = useAssignmentStore.getState();
    if (st.assignmentId == null) st.setAssignmentId(1);
    if (st.week == null) st.setWeek(1);
  }, [fromSaved]);

  const recordId: string | number | undefined = (
    location.state as { recordId?: string | number } | undefined
  )?.recordId;

  // 문자열 정규화
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFKC')
      .replace(/[\s_\-./\\]+/g, '');

  // --- 서버 데이터
  const {
    data: graphData,
    isLoading: isGraphLoading,
    isError: isGraphError,
  } = useSimilarityGraph({
    assignmentId: assignmentId ?? 0,
    week: week ?? 0,
  });

  const {
    data: topoData,
    isLoading: isTopoLoading,
    isError: isTopoError,
  } = useSimilarityTopology({
    assignmentId: assignmentId ?? 0,
    week: week ?? 0,
  });

  // PieChart props
  const passedCount = graphData?.summary.aboveThreshold ?? 0;
  const failedCount = graphData?.summary.belowThreshold ?? 0;

  // topology → 그래프 노드/엣지
  const graphNodes: FileNode[] = useMemo(() => {
    const list = topoData?.nodes ?? [];
    return list.map((n) => ({
      id: String(n.id),
      label: n.label,
      submittedAt: n.submittedAt ?? '-',
    }));
  }, [topoData]);

  const graphEdges: FileEdge[] = useMemo(() => {
    const list = topoData?.edges ?? [];
    return list.map((e) => ({
      from: String(e.from),
      to: String(e.to),
      similarity: Math.round((e.value ?? 0) * 100),
    }));
  }, [topoData]);

  // 분위수 컷 (q90, q70, q40)
  const quantileCuts = useMemo(() => {
    const sims = graphEdges.map((e) => e.similarity).sort((a, b) => a - b);
    return {
      very: Math.round(quantile(sims, 0.9)), // 상위 10%
      high: Math.round(quantile(sims, 0.7)), // 10~30%
      mid: Math.round(quantile(sims, 0.4)), // 30~60%
    };
  }, [graphEdges]);

  // ✅ 하이브리드 분류: (절대 %) OR (분위수)
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

  // 구간 필터 + 검색 + 파이 클릭
  const filteredEdges = useMemo(() => {
    let es = graphEdges;

    // 1) 구간 체크박스 적용 (하이브리드)
    es = es.filter((e) => showBands[edgeToBandHybrid(e.similarity)]);

    // 2) 파이 클릭: 기준 초과만 보기
    if (showOnlyAboveThreshold) {
      es = es.filter((e) => e.similarity >= THRESHOLD);
    }

    // 3) 검색 포커스
    if (focusNodeId) {
      es = es.filter((e) => e.from === focusNodeId || e.to === focusNodeId);
    }

    return es;
  }, [
    graphEdges,
    showBands,
    focusNodeId,
    showOnlyAboveThreshold,
    quantileCuts,
  ]);

  // 엣지에 맞춰 노드 축소
  const filteredNodes = useMemo(() => {
    if (!filteredEdges.length)
      return focusNodeId ? graphNodes.filter((n) => n.id === focusNodeId) : [];
    const keep = new Set<string>();
    for (const e of filteredEdges) {
      keep.add(e.from);
      keep.add(e.to);
    }
    if (focusNodeId) keep.add(focusNodeId);
    return graphNodes.filter((n) => keep.has(n.id));
  }, [graphNodes, filteredEdges, focusNodeId]);

  // StoreFileData
  const storeFilesFromTopo: StoreFileData[] = useMemo(() => {
    if (!topoData?.nodes) return [];
    return topoData.nodes.map((n) => ({
      id: String(n.id),
      label: n.label,
      submittedAt: n.submittedAt ?? '-',
      content: [],
      similarMap: {},
    }));
  }, [topoData]);

  const fileMap = useMemo(() => {
    const m = new Map<string, StoreFileData>();
    for (const f of storeFilesFromTopo) m.set(String(f.id), f);
    return m;
  }, [storeFilesFromTopo]);

  // 저장된 기록에서 불러오기
  useEffect(() => {
    if (fromSaved && recordId != null) {
      useSavedRecordStore.getState().selectRecordById(String(recordId));
      const selected = useSavedRecordStore.getState().selectedRecord;
      if (selected && selected.type === 'network') {
        useSelectedFileStore.getState().setFiles(selected.nodes ?? []);
      }
    }
  }, [fromSaved, recordId]);

  // 기본 파일 세팅
  useEffect(() => {
    if (fromSaved) return;
    if (storeFilesFromTopo.length > 0) {
      setFiles(storeFilesFromTopo);
    } else {
      setFiles(normalizeToStoreData(dummyFiles as ReadonlyArray<DummyLike>));
    }
  }, [fromSaved, setFiles, storeFilesFromTopo]);

  // 그래프 노드 정규화 캐시
  const normNodes = useMemo(
    () =>
      graphNodes.map((n) => ({
        id: n.id,
        normId: normalize(n.id),
        normLabel: normalize(n.label ?? ''),
      })),
    [graphNodes]
  );

  // 검색
  useEffect(() => {
    const raw = focusQuery.trim();
    if (!raw) {
      setFocusNodeId(null);
      return;
    }
    const q = normalize(raw);

    let found = normNodes.find((n) => n.normId === q); // 학번 완전일치
    if (!found) found = normNodes.find((n) => n.normLabel.includes(q)); // 이름 부분일치
    setFocusNodeId(found ? found.id : null);
  }, [focusQuery, normNodes]);

  // node id → label 맵 (파이 hover에서 사용)
  const nodeById = useMemo(
    () => new Map(graphNodes.map((n) => [n.id, { id: n.id, label: n.label }])),
    [graphNodes]
  );

  const handlePieHover = (segment: '기준 이하' | '기준 초과' | null) => {
    if (!segment || !graphData) {
      // null이면 기존 상태 유지
      return;
    }
    setActiveSegment(segment);
    const isAbove = segment === '기준 초과';
    const bucket = isAbove
      ? graphData.pairs.aboveThreshold
      : graphData.pairs.belowThreshold;

    const pairs: HoverPair[] = (bucket as BucketPair[])
      .map((e) => {
        const from = String(e.from);
        const to = String(e.to);
        const a = nodeById.get(from);
        const b = nodeById.get(to);
        if (!a || !b) return null;
        const sim =
          typeof e.similarity === 'number'
            ? Math.round(e.similarity)
            : Math.round((Number(e.value) || 0) * 100);
        return {
          from,
          to,
          similarity: sim,
          aLabel: a.label,
          bLabel: b.label,
        };
      })
      .filter((x): x is HoverPair => !!x)
      .sort((a, b) => b.similarity - a.similarity);

    setHoveredPairs(pairs);
  };

  // 파이 클릭 → 기준 초과 토글
  const handlePieClick = (name: '기준 이하' | '기준 초과') => {
    setShowOnlyAboveThreshold(name === '기준 초과');
    setActiveSegment(name);
    handlePieHover(name); // 즉시 목록 고정 갱신
  };

  // KPI
  const kpi = useMemo(() => {
    const totalFiles = graphNodes.length;
    const pairCount = graphEdges.length;
    const flaggedPairs = graphEdges.filter(
      (e) => e.similarity >= THRESHOLD
    ).length;
    return { totalFiles, pairCount, flaggedPairs };
  }, [graphNodes, graphEdges]);

  // 상위 유사쌍
  const topPairs = useMemo(() => {
    return graphEdges
      .map((e) => {
        const a = graphNodes.find((n) => n.id === e.from);
        const b = graphNodes.find((n) => n.id === e.to);
        return a && b ? { ...e, a, b } : null;
      })
      .filter((x): x is FileEdge & { a: FileNode; b: FileNode } => x !== null)
      .sort((x, y) => y.similarity - x.similarity)
      .slice(0, 5);
  }, [graphNodes, graphEdges]);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 py-8">
        {selectedSubject?.subjectName && (
          <div className="mb-5 inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-blue-700">
            <span className="mr-2">📚</span>
            <Text variant="caption" weight="medium">
              과목명: {selectedSubject?.subjectName}
            </Text>
          </div>
        )}

        <div className="mb-6">
          <Text variant="h2" weight="bold" className="text-gray-900">
            <span className="text-blue-600">
              {name} ({week}주차)
            </span>{' '}
            유사도 분석 결과
          </Text>
        </div>

        {/* KPI */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        </div>

        {/* 요약(파이) + 관련 파일 */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            {isGraphLoading ? (
              <Text variant="caption" color="muted">
                1차 필터링 요약 불러오는 중...
              </Text>
            ) : isGraphError ? (
              <Text variant="caption" color="muted">
                요약 불러오기 실패. 잠시 후 다시 시도해 주세요.
              </Text>
            ) : (
              <SimilarityPieChart
                passedCount={passedCount}
                failedCount={failedCount}
                onHover={handlePieHover}
                onSegmentClick={handlePieClick}
              />
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            {hoveredPairs.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Text variant="h3" weight="bold" className="text-gray-900">
                      {activeSegment ?? '유사쌍'}
                    </Text>
                    {activeSegment && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {activeSegment}
                      </span>
                    )}
                  </div>
                  <Text variant="caption" color="muted">
                    총 {hoveredPairs.length}쌍
                  </Text>
                </div>
                <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  {hoveredPairs.map((p) => {
                    const key = `${p.from}-${p.to}`;
                    return (
                      <li
                        key={key}
                        className="py-2 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-gray-900">
                            {p.aLabel}{' '}
                            <span className="mx-1 text-gray-400">·</span>{' '}
                            {p.bLabel}
                          </p>
                          <Text variant="caption" color="muted">
                            유사도 {p.similarity}%
                          </Text>
                        </div>
                        <Button
                          text="비교"
                          variant="ghost"
                          size="sm"
                          icon={<FiChevronRight />}
                          iconPosition="right"
                          onClick={() => {
                            const a = fileMap.get(p.from);
                            const b = fileMap.get(p.to);
                            if (a && b) {
                              setSelectedFiles(a, b);
                              navigate(
                                `/compare/${String(a.id)}/${String(b.id)}`
                              );
                            }
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="text-gray-500">
                <Text variant="body" color="muted">
                  파이차트 영역을 호버하거나 클릭하면 해당 구간의 유사쌍 목록이
                  표시됩니다.
                </Text>
                <Text variant="caption" color="muted" className="block mt-1">
                  * 클릭 시 목록이 고정되며, 다른 영역을 호버/클릭하면
                  갱신됩니다.
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* 컨트롤 바 (드롭다운 제거, 하이브리드 설명 라벨) */}
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={showBands.very}
              onChange={(e) =>
                setShowBands((s) => ({ ...s, very: e.target.checked }))
              }
            />
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              매우 높음 (≥90% 또는 상위 10%)
            </span>
          </label>

          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={showBands.high}
              onChange={(e) =>
                setShowBands((s) => ({ ...s, high: e.target.checked }))
              }
            />
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
              높음 (75~90% 또는 상위 10~30%)
            </span>
          </label>

          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={showBands.mid}
              onChange={(e) =>
                setShowBands((s) => ({ ...s, mid: e.target.checked }))
              }
            />
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              중간 (60~75% 또는 상위 30~60%)
            </span>
          </label>

          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={showBands.low}
              onChange={(e) =>
                setShowBands((s) => ({ ...s, low: e.target.checked }))
              }
            />
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
              낮음 (그 외)
            </span>
          </label>

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

        {/* 그래프 + 상위 유사쌍 */}
        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
          {/* 그래프 */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <Text variant="h3" weight="bold">
                유사도 네트워크 그래프
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
              nodes={filteredNodes.length ? filteredNodes : graphNodes}
              edges={filteredEdges.length ? filteredEdges : graphEdges}
              interactionOptions={{
                zoomView: false,
                dragView: false,
                dragNodes: false,
              }}
              onNodeHover={(node) => {
                const connectedFiles = graphEdges
                  .filter((e) => e.from === node.id || e.to === node.id)
                  .map((e) =>
                    graphNodes.find(
                      (n) => n.id === (e.from === node.id ? e.to : e.from)
                    )
                  )
                  .filter((n): n is FileNode => Boolean(n));
                setHoverInfo(
                  [
                    `📄 파일명: ${node.label}`,
                    `🕒 제출 시간: ${node.submittedAt}`,
                    '',
                    `🔗 연결된 유사 파일:`,
                    ...connectedFiles.map((n) => `• ${n.label}`),
                  ].join('\n')
                );
              }}
              onEdgeHover={(edge) => {
                const from = graphNodes.find((n) => n.id === edge.from);
                const to = graphNodes.find((n) => n.id === edge.to);
                if (from && to) {
                  setHoverInfo(
                    `🔗 유사도: ${edge.similarity}%\n📁 ${from.label} - ${to.label}\n🕒 ${from.submittedAt} / ${to.submittedAt}`
                  );
                }
              }}
              onEdgeClick={(edge) => {
                const fileA = fileMap.get(String(edge.from));
                const fileB = fileMap.get(String(edge.to));
                if (fileA && fileB) {
                  setSelectedFiles(fileA, fileB);
                  navigate(`/compare/${String(fileA.id)}/${String(fileB.id)}`);
                }
              }}
            />

            <div className="mb-2 text-xs">
              {isTopoLoading && (
                <span className="text-blue-600">
                  네트워크 토폴로지 불러오는 중…
                </span>
              )}
              {isTopoError && (
                <span className="text-red-600">
                  토폴로지 로딩 실패. 데모 데이터를 표시합니다.
                </span>
              )}
            </div>

            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800">
              {hoverInfo ? (
                hoverInfo
                  .split('\n')
                  .map((line, idx) => <p key={idx}>{line}</p>)
              ) : (
                <Text variant="caption" color="muted">
                  그래프에서 노드/엣지를 호버/클릭하면 상세 정보가 여기에
                  표시됩니다.
                </Text>
              )}
            </div>
          </div>

          {/* 상위 유사 쌍 */}
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
                  return (
                    <li
                      key={key}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-gray-900">
                          {p.a.label}{' '}
                          <span className="mx-1 text-gray-400">·</span>{' '}
                          {p.b.label}
                        </p>
                        <Text variant="caption" color="muted">
                          유사도 {p.similarity}%
                        </Text>
                      </div>
                      <Button
                        text="비교"
                        variant="ghost"
                        size="sm"
                        icon={<FiChevronRight />}
                        iconPosition="right"
                        onClick={() => {
                          const a = fileMap.get(p.from);
                          const b = fileMap.get(p.to);
                          if (a && b) {
                            setSelectedFiles(a, b);
                            navigate(
                              `/compare/${String(a.id)}/${String(b.id)}`
                            );
                          }
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        </div>

        <div className="flex justify-end">
          <Button
            text="대시보드로 이동"
            variant="secondary"
            size="lg"
            onClick={() => navigate('/dashboard')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ResultPage;
