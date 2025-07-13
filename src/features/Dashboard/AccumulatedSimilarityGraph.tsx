import React, { useMemo, useState } from 'react';
import Text from '@components/Text';
import SimilarityGraph from '@features/Result/SimilarityGraph';
import { dummyAssignments } from '@constants/dummyAssignments';
import { accumulateSimilarityData } from '@utils/accumulateSimilarity';

const AccumulatedSimilarityGraph: React.FC = () => {
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);

  // 누적 유사도 데이터 가공
  const { nodes, edges } = useMemo(() => {
    return accumulateSimilarityData(dummyAssignments);
  }, []);

  return (
    <div className="grid grid-cols-10 gap-8 items-start">
      {/* 좌측: 누적 네트워크 그래프 */}
      <div className="col-span-6 bg-white p-4 rounded shadow">
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
            const connectedNames = connected.map((e) => {
              const otherId = e.from === node.id ? e.to : e.from;
              return nodes.find((n) => n.id === otherId)?.label;
            });

            setHoverInfo(
              [
                `📄 학생명: ${node.label}`,
                '',
                ...connectedNames.map((n) => `• ${n}`),
              ].join('\n')
            );
          }}
          onEdgeHover={(edge) => {
            const from = nodes.find((n) => n.id === edge.from);
            const to = nodes.find((n) => n.id === edge.to);
            setHoverInfo(
              `👥 ${from?.label} ↔ ${to?.label}\n유사도 평균: ${edge.similarity}%\n관측 횟수: ${edge.count}회`
            );
          }}
        />
      </div>

      {/* 우측: 요약 테이블 */}
      <div className="col-span-4 bg-white p-4 rounded shadow">
        <Text variant="body" weight="bold" className="mb-2 border-b pb-1">
          2회 이상 높은 유사도가 관측된 학생 쌍
        </Text>
        <table className="w-full text-left">
          <thead className="text-gray-500 font-medium border-b">
            <tr>
              <th>학생 쌍</th>
              <th>유사도</th>
              <th>관측 횟수</th>
            </tr>
          </thead>
          <tbody>
            {edges
              .filter((e) => e.count >= 2)
              .map((e) => {
                const from = nodes.find((n) => n.id === e.from);
                const to = nodes.find((n) => n.id === e.to);
                return (
                  <tr key={`${e.from}-${e.to}`} className="border-b">
                    <td>
                      {from?.label} ↔ {to?.label}
                    </td>
                    <td className="text-danger font-bold">{e.similarity}%</td>
                    <td className="text-primary font-bold">{e.count}회</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* 하단: hover 정보 */}
        {hoverInfo && (
          <div className="mt-4 p-3 border border-gray-200 rounded bg-gray-50 whitespace-pre-line text-gray-700">
            {hoverInfo}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccumulatedSimilarityGraph;
