// src/features/Result/SimilarityPieChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

interface SimilarityPieChartProps {
  passedCount: number; // 임계값 초과
  failedCount: number; // 임계값 이하
  onHover?: (segmentName: string) => void;
}

const COLORS = ['#60A5FA', '#F87171']; // 기준 이하: 파랑, 초과: 빨강

const SimilarityPieChart: React.FC<SimilarityPieChartProps> = ({
  passedCount,
  failedCount,
  onHover,
}) => {
  const data = [
    { name: '기준 이하', value: failedCount },
    { name: '기준 초과', value: passedCount },
  ];

  const handleMouseEnter = (data: { name: string; value: number }) => {
    if (onHover) onHover(data.name);
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-4">1차 필터링 결과</h3>
      <p className="text-base text-gray-700 mb-5 text-center leading-relaxed">
        설정된 유사도 임계값을 기준으로 사전 필터링된 결과입니다. <br />
        기준 초과 파일 {passedCount}개, 기준 이하 파일 {failedCount}개의 비율을
        확인하세요.
      </p>

      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={110}
          dataKey="value"
          onMouseEnter={handleMouseEnter}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default SimilarityPieChart;
