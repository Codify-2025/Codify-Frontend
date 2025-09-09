import React, { useMemo, useState } from 'react';
import Text from '@components/Text';
import SimilarityGraph from '@features/Result/SimilarityGraph';
import { useSubjectStore } from '@stores/useSubjectStore';
import { ErrorState, LoadingSkeleton } from '@components/LoadingState';
import { useAccumulatedTopology } from '@hooks/useAccumulatedTopology';

const AccumulatedSimilarityGraph: React.FC = () => {
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const { selectedSubject } = useSubjectStore();

  const subjectId = selectedSubject ? Number(selectedSubject.id) : undefined;
  const { data, isLoading, isError } = useAccumulatedTopology(subjectId);

  // 누적 유사도 데이터
  const { nodes, edges } = useMemo(() => {
    if (!data) return { nodes: [], edges: [] };

    const nodes = data.nodes.map((n) => ({
      id: String(n.id),
      label: n.label,
      submittedAt: '',
    }));

    const edges = data.edges.map((e) => ({
      from: String(e.from),
      to: String(e.to),
      similarity: Math.round((e.value ?? 0) * 100),
      count: e.count,
      width: e.width,
    }));

    return { nodes, edges };
  }, [data]);

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-10">
      {/* 그래프 */}
      <div className="col-span-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 lg:col-span-6">
        <div className="mb-3 flex items-center justify-between">
          <Text variant="h3" weight="bold" className="text-gray-900">
            전체 네트워크
          </Text>
        </div>

        <SimilarityGraph
          nodes={nodes}
          edges={edges}
          interactionOptions={{
            zoomView: false,
            dragView: false,
            dragNodes: false,
          }}
          onNodeHover={(node) => {
            const connected = edges.filter(
              (e) => e.from === node.id || e.to === node.id
            );

            const connectedNames = connected
              .map((e) => {
                const otherId = e.from === node.id ? e.to : e.from;
                const other = nodes.find((n) => n.id === otherId);
                return other?.label ?? otherId;
              })
              .filter(Boolean);

            setHoverInfo(
              [
                '📄 학생명: ' + node.label,
                '',
                ...connectedNames.map((n) => `• ${n}`),
              ].join('\n')
            );
          }}
          onEdgeHover={(edge) => {
            const from = nodes.find((n) => n.id === edge.from);
            const to = nodes.find((n) => n.id === edge.to);
            setHoverInfo(
              `👥 ${from?.label} ↔ ${to?.label}\n유사도 평균: ${edge.similarity}%\n관측 횟수: ${edge.count ?? 1}회`
            );
          }}
        />
      </div>

      {/* 요약 패널 */}
      <div className="col-span-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 lg:col-span-4">
        <Text variant="body" weight="bold" className="mb-3 border-b pb-2">
          2회 이상 높은 유사도 관측 학생 쌍
        </Text>

        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2">학생 쌍</th>
                <th className="px-3 py-2">유사도</th>
                <th className="px-3 py-2">관측</th>
              </tr>
            </thead>
            <tbody>
              {edges
                .filter((e) => (e.count ?? 0) >= 2)
                .map((e) => {
                  return (
                    <tr key={`${e.from}-${e.to}`} className="border-t">
                      <td className="px-3 py-2">
                        {nodes.find((n) => n.id === e.from)?.label ?? e.from} ↔{' '}
                        {nodes.find((n) => n.id === e.to)?.label ?? e.to}
                      </td>
                      <td className="px-3 py-2 font-semibold text-red-600">
                        {e.similarity}%
                      </td>
                      <td className="px-3 py-2 font-semibold text-blue-700">
                        {e.count}회
                      </td>
                    </tr>
                  );
                })}
              {edges.filter((e) => (e.count ?? 0) >= 2).length === 0 && (
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

        {/* Hover 정보 */}
        {hoverInfo && (
          <div className="mt-4 whitespace-pre-line rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-700">
            {hoverInfo}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccumulatedSimilarityGraph;
