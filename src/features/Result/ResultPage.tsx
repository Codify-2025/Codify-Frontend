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
import { useAuthStore } from '@stores/useAuthStore';
import { useSubjectStore } from '@stores/useSubjectStore';
import { FiChevronRight } from 'react-icons/fi';
import type { FileNode, FileEdge } from 'types/similarity';
import type { FileData as StoreFileData } from '@stores/useSelectedFileStore';
import { useSimilarityGraph } from '@hooks/useSimilarityGraph';
import { useSimilarityTopology } from '@hooks/useSimilarityTopology';

const THRESHOLD = 80;

/** dummyFiles 형태(느슨) */
type DummyLike = {
  id: string;
  label: string;
  submittedAt: string;
  content?: unknown; // string | string[] | unknown
  similarMap?: unknown; // Record<unknown, unknown> | unknown
};

/** content: string|string[] -> string[] 로 정규화
 *  similarMap: unknown -> Record<number, string[]> 로 정규화 (없으면 {})
 */
function normalizeToStoreData(list: readonly DummyLike[]): StoreFileData[] {
  return list.map<StoreFileData>((f) => {
    // 1) content 정규화
    const rawContent = f.content;
    let content: string[] = [];
    if (Array.isArray(rawContent)) {
      content = rawContent.filter((v): v is string => typeof v === 'string');
    } else if (typeof rawContent === 'string') {
      content = [rawContent];
    }

    // 2) similarMap 정규화: 키를 number로, 값을 string[]로 강제
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

    // 3) 스토어 타입으로 반환 (similarMap은 항상 객체)
    return {
      id: f.id,
      label: f.label,
      submittedAt: f.submittedAt,
      content,
      similarMap: map,
    };
  });
}

// 날짜 포맷 유틸
const formatDate = (iso?: string) => {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return iso;
  }
};

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { name, week, assignmentId } = useAssignmentStore();
  const { selectedSubject } = useSubjectStore();
  const { isLoggedIn } = useAuthStore();

  // 스토어 액션
  const { setFiles, setSelectedFiles } = useSelectedFileStore();

  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const [hoveredFiles, setHoveredFiles] = useState<FileNode[]>([]);

  const fromSaved: boolean | undefined = (
    location.state as { fromSaved?: boolean } | undefined
  )?.fromSaved;
  const recordId: string | number | undefined = (
    location.state as { recordId?: string | number } | undefined
  )?.recordId;

  // 1차 필터링 결과 그래프 데이터
  const {
    data: graphData,
    isLoading: isGraphLoading,
    isError: isGraphError,
  } = useSimilarityGraph({
    assignmentId: assignmentId ?? 0, // enabled 조건이 걸려 있으니 0이면 호출 안 됨
    week: week ?? 0,
  });

  // 토폴로지 데이터
  const {
    data: topoData,
    isLoading: isTopoLoading,
    isError: isTopoError,
  } = useSimilarityTopology({
    assignmentId: assignmentId ?? 0,
    week: week ?? 0,
  });

  // --- API → UI 매핑: value(0~1) → similarity(%) ---
  const apiNodes: FileNode[] = useMemo(() => {
    if (!topoData?.message?.nodes) return [];
    return topoData.message.nodes.map((n) => ({
      id: String(n.id),
      label: n.label,
      submittedAt: formatDate(n.submittedAt), // ISO → 읽기 쉬운 포맷
    }));
  }, [topoData]);

  const apiEdges: FileEdge[] = useMemo(() => {
    if (!topoData?.message?.edges) return [];
    return topoData.message.edges.map((e) => ({
      from: String(e.from),
      to: String(e.to),
      similarity: Math.round((e.value ?? 0) * 100), // 0~1 → %
    }));
  }, [topoData]);

  // 그래프에 실제로 넘길 데이터 (API 성공 시 교체 / 실패 시 로컬 데모)
  const fallbackNodesFromDummy: FileNode[] = useMemo(() => {
    const dummy = normalizeToStoreData(dummyFiles as ReadonlyArray<DummyLike>);
    return dummy.map(({ id, label, submittedAt }) => ({
      id,
      label,
      submittedAt,
    }));
  }, []);
  const fallbackEdges: FileEdge[] = useMemo(
    () => [
      { from: '1', to: '2', similarity: 92 },
      { from: '1', to: '3', similarity: 87 },
      { from: '2', to: '3', similarity: 75 },
    ],
    []
  );

  const graphNodes: FileNode[] =
    apiNodes.length > 0 ? apiNodes : fallbackNodesFromDummy;
  const graphEdges: FileEdge[] = apiEdges.length > 0 ? apiEdges : fallbackEdges;

  // --- 스토어에 들어갈 파일 리스트도 topology 응답 기준으로 구성 (없으면 dummy fallback)
  const fileDataList: StoreFileData[] = useMemo(() => {
    if (apiNodes.length > 0) {
      return apiNodes.map((n) => ({
        id: n.id,
        label: n.label,
        submittedAt: n.submittedAt,
        content: [], // ComparePage에서 compare API 응답으로 덮어씀
        similarMap: {},
      }));
    }
    // 서버/데모 데이터가 전혀 없을 때만 기존 더미 사용
    return normalizeToStoreData(dummyFiles as ReadonlyArray<DummyLike>);
  }, [apiNodes]);

  // id → StoreFileData 빠른 조회
  const fileMap = useMemo(() => {
    const m = new Map<string, StoreFileData>();
    for (const f of fileDataList) m.set(f.id, f);
    return m;
  }, [fileDataList]);

  // PieChart props
  const passedCount = graphData?.summary.aboveThreshold ?? 0;
  const failedCount = graphData?.summary.belowThreshold ?? 0;

  // graph 응답 전용 id→label 맵 (파이 hover는 이것만 이용!)
  const graphNodeById = useMemo(() => {
    const m = new Map<string, { id: string; label: string }>();
    if (graphData?.nodes) {
      for (const n of graphData.nodes) {
        m.set(String(n.id), { id: String(n.id), label: n.label });
      }
    }
    return m;
  }, [graphData]);

  const handlePieHover = (segment: '기준 이하' | '기준 초과' | null) => {
    if (!segment || !graphData) {
      setHoveredFiles([]);
      return;
    }
    const isAbove = segment === '기준 초과';
    const bucket = isAbove
      ? graphData.pairs.aboveThreshold
      : graphData.pairs.belowThreshold;

    const relatedIds = new Set<string>();
    for (const e of bucket) {
      relatedIds.add(String(e.from));
      relatedIds.add(String(e.to));
    }

    const related = Array.from(relatedIds)
      .map((id) => graphNodeById.get(id)) // ★ 그래프 노드 맵 사용
      .filter((n): n is { id: string; label: string } => Boolean(n))
      .map((n) => ({ id: n.id, label: n.label, submittedAt: '-' }));

    setHoveredFiles(related);
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

  const handleSave = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: 'result' } });
      return;
    }
    // TODO: 실제 저장 로직
    console.log('결과 저장 진행');
  };

  // 저장된 기록에서 불러오기
  useEffect(() => {
    if (fromSaved && recordId != null) {
      // ✅ string | number → string 변환
      useSavedRecordStore.getState().selectRecordById(String(recordId));
      const selected = useSavedRecordStore.getState().selectedRecord;
      if (selected && selected.type === 'network') {
        // selected.nodes가 StoreFileData[]라고 가정
        useSelectedFileStore.getState().setFiles(selected.nodes ?? []);
      }
    }
  }, [fromSaved, recordId]);

  // 기본 파일 세팅: 스토어는 StoreFileData[] 기대 (topology 기반 리스트를 주입)
  useEffect(() => {
    if (!fromSaved) setFiles(fileDataList);
  }, [fromSaved, setFiles, fileDataList]);

  // 상위 유사쌍 (실데이터 기준 — graphEdges/graphNodes)
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
          <Text variant="caption" color="muted" className="mt-1">
            기준 유사도 {THRESHOLD}% 이상은 강조 표시됩니다.
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
                요약 불러오기에 실패했어요. 잠시 후 다시 시도해 주세요.
              </Text>
            ) : (
              <SimilarityPieChart
                passedCount={passedCount}
                failedCount={failedCount}
                onHover={handlePieHover}
              />
            )}
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-blue-800 shadow-sm">
            {hoveredFiles.length > 0 ? (
              <div className="space-y-2">
                <Text variant="body" weight="medium">
                  해당 파일
                </Text>
                <ul className="list-disc pl-5">
                  {hoveredFiles.map((f) => (
                    <li key={f.id}>
                      <span className="font-medium">{f.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Text variant="body" color="muted">
                파이차트의 항목에 마우스를 올리면 관련 파일 목록이 표시됩니다.
              </Text>
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
              nodes={graphNodes}
              edges={graphEdges}
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
                const fileA = fileMap.get(edge.from);
                const fileB = fileMap.get(edge.to);
                if (fileA && fileB) {
                  setSelectedFiles(fileA, fileB);
                  navigate(`/compare/${String(fileA.id)}/${String(fileB.id)}`);
                }
              }}
            />

            {/* 그래프 카드 상단에 API 상태 표시 */}
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
                  그래프에서 노드 또는 엣지를 호버/클릭하면 상세 정보가 여기에
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
                  const key = `${p.from}-${p.to}`; // FileEdge에 id 없음 → 합성 key
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
                            setSelectedFiles(a, b); // ✅ StoreFileData 전달
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
            text="결과 저장하기"
            variant="primary"
            size="lg"
            onClick={handleSave}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ResultPage;
