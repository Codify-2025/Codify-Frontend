// src/features/Result/ResultPage.tsx
import React, { useState } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import SimilarityPieChart from './SimilarityPieChart';
import SimilarityGraph from './SimilarityGraph';
import { useAssignmentStore } from '@stores/assignmentStore';

interface FileNode {
  id: string;
  label: string;
  submittedAt: string;
}

const ResultPage: React.FC = () => {
  const { name, week } = useAssignmentStore();
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const [hoveredFiles, setHoveredFiles] = useState<FileNode[]>([]);

  // 예시 데이터
  const nodes: FileNode[] = Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 1}`,
    label: `학생${i + 1}.cpp`,
    submittedAt: `2025-03-29 17:${(i + 10).toString().padStart(2, '0')}`,
  }));

  const edges = [
    { from: '1', to: '2', similarity: 92 },
    { from: '1', to: '3', similarity: 87 },
    { from: '2', to: '4', similarity: 64 },
    { from: '5', to: '6', similarity: 45 },
    { from: '6', to: '7', similarity: 78 },
    { from: '8', to: '9', similarity: 88 },
    { from: '3', to: '10', similarity: 59 },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-8 py-10 text-base">
        {/* 제목 */}
        <h1 className="text-4xl font-bold text-black mb-10">
          <span className="text-blue-500">
            {name} ({week}주차)
          </span>{' '}
          유사도 분석 결과
        </h1>

        {/* 파이차트 + 설명 */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-4 rounded shadow">
            <SimilarityPieChart
              passedCount={6}
              failedCount={4}
              onHover={(segment) => {
                const target =
                  segment === '기준 초과' ? nodes.slice(0, 6) : nodes.slice(6);
                setHoveredFiles(target);
              }}
            />
          </div>
          <div className="bg-blue-50 text-blue-700 p-4 rounded shadow whitespace-pre-line text-lg">
            {hoveredFiles.length > 0
              ? hoveredFiles
                  .map((f) => `📄 ${f.label} (${f.submittedAt})`)
                  .join('\n')
              : '파이차트에서 항목에 마우스를 올리면 관련 파일이 여기에 표시됩니다.'}
          </div>
        </div>

        {/* 유사도 네트워크 그래프 */}
        <div className="mb-3">
          <Text variant="body" weight="bold" className="text-xl mb-2">
            유사도 네트워크
          </Text>
          <div className="bg-white p-4 rounded shadow">
            <SimilarityGraph
              nodes={nodes}
              edges={edges}
              interactionOptions={{
                zoomView: true,
                dragView: false,
                dragNodes: false,
              }}
              onNodeHover={(node) => {
                const connectedFiles = edges
                  .filter((e) => e.from === node.id || e.to === node.id)
                  .map((e) => {
                    const otherId = e.from === node.id ? e.to : e.from;
                    return nodes.find((n) => n.id === otherId);
                  })
                  .filter(Boolean);
                setHoverInfo(
                  [
                    `📄 파일명: ${node.label}`,
                    `🕒 제출 시간: ${node.submittedAt}`,
                    '',
                    `🔗 연결된 유사 파일:`,
                    ...connectedFiles.map((n) => `• ${n?.label}`),
                  ].join('\n')
                );
              }}
              onEdgeHover={(edge) => {
                const from = nodes.find((n) => n.id === edge.from);
                const to = nodes.find((n) => n.id === edge.to);
                if (from && to) {
                  setHoverInfo(
                    `🔗 유사도: ${edge.similarity}%\n📁 ${from.label} - ${to.label}\n🕒 ${from.submittedAt} / ${to.submittedAt}`
                  );
                }
              }}
            />
          </div>
        </div>

        {/* 네트워크 그래프 설명 */}
        <div className="bg-blue-50 text-blue-700 p-4 rounded text-lg whitespace-pre-line shadow mb-8">
          {hoverInfo ||
            '그래프에서 노드(파일)나 엣지(유사도)를 선택하면 상세 정보가 여기에 표시됩니다.'}
        </div>

        {/* 결과 저장 버튼 */}
        <div className="flex justify-end">
          <Button text="결과 저장하기" variant="primary" />
        </div>
      </div>
    </Layout>
  );
};

export default ResultPage;
