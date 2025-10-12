import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Text from '@components/Text';

type PieDatum = { name: '기준 이하' | '기준 초과'; value: number };

interface SimilarityPieChartProps {
  passedCount: number; // 임계값 초과
  failedCount: number; // 임계값 이하
  onHover?: (segmentName: PieDatum['name'] | null) => void;
  onSegmentClick?: (segmentName: PieDatum['name']) => void;
}

const COLORS = ['#60A5FA', '#EF4444']; // 이하: 파랑, 초과: 빨강

const SimilarityPieChart: React.FC<SimilarityPieChartProps> = ({
  passedCount,
  failedCount,
  onHover,
  onSegmentClick,
}) => {
  const data: PieDatum[] = [
    { name: '기준 이하', value: failedCount },
    { name: '기준 초과', value: passedCount },
  ];
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const handleEnter = (_entry: unknown, index: number) => {
    const seg = data[index];
    if (seg) onHover?.(seg.name);
  };

  return (
    <div className="flex flex-col">
      <Text variant="h3" weight="bold" className="mb-2 text-gray-900">
        1차 필터링 결과
      </Text>
      <Text variant="caption" color="muted" className="mb-4">
        설정된 임계값을 기준으로 사전 필터링된 비율입니다.
      </Text>

      <div className="relative mx-auto w-full">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              onClick={(_, idx) => {
                const seg = typeof idx === 'number' ? data[idx] : undefined;
                if (seg) onSegmentClick?.(seg.name);
              }}
              onMouseEnter={handleEnter}
              labelLine={false}
              label={(props: { name: PieDatum['name']; percent: number }) =>
                total
                  ? `${props.name} ${(props.percent * 100).toFixed(0)}%`
                  : ''
              }
            >
              {data.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[i % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* 중앙 KPI */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-gray-500">기준 초과</div>
            <div className="text-xl font-bold text-red-600">{passedCount}</div>
            <div className="text-xs text-gray-400">/ 총 {total}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarityPieChart;
