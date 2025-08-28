import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Text from '@components/Text';

interface SimilarityPieChartProps {
  passedCount: number; // 임계값 초과
  failedCount: number; // 임계값 이하
  onHover?: (segmentName: PieDatum['name'] | null) => void;
}

type PieDatum = { name: '기준 이하' | '기준 초과'; value: number };

const COLORS = ['#60A5FA', '#EF4444']; // 이하: 파랑, 초과: 빨강

const SimilarityPieChart: React.FC<SimilarityPieChartProps> = ({
  passedCount,
  failedCount,
  onHover,
}) => {
  const data: PieDatum[] = [
    { name: '기준 이하', value: failedCount },
    { name: '기준 초과', value: passedCount },
  ];

  // ↑ any 대신 명시 타입 사용: 첫 번째 파라미터는 사용 안 하므로 unknown으로 안전 처리
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

      <div className="mx-auto w-full max-w-xs">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
              onMouseEnter={handleEnter}
              onMouseLeave={() => onHover?.(null)}
              // ↑ any 제거: 라벨 props 타입 명시
              label={(props: { name: PieDatum['name']; percent: number }) =>
                `${props.name} ${(props.percent * 100).toFixed(0)}%`
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
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: COLORS[0] }}
          />
          기준 이하
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: COLORS[1] }}
          />
          기준 초과
        </span>
      </div>
    </div>
  );
};

export default SimilarityPieChart;
