import React, { useMemo, useState } from 'react';
import Text from '@components/Text';
import { savedAnalysisRecords } from './SavedAnalysisDummy';
import { SavedAnalysisRecord } from './SavedAnalysisType';
import SavedAnalysisItem from './SavedAnalysisItem';

type SortOption = 'latest' | 'similarity';

const SavedAnalysisSection: React.FC = () => {
  const [sortOption, setSortOption] = useState<SortOption>('latest');

  // 정렬된 리스트
  const sorted = useMemo(() => {
    const cloned = [...savedAnalysisRecords];
    if (sortOption === 'similarity') {
      return cloned.sort((a, b) => {
        if (a.type !== 'pair') return 1;
        if (b.type !== 'pair') return -1;
        return b.similarity - a.similarity;
      });
    } else {
      return cloned.sort(
        (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      );
    }
  }, [sortOption]);

  // 주차별로 그룹핑
  const groupedByWeek = useMemo(() => {
    const map = new Map<number, SavedAnalysisRecord[]>();
    sorted.forEach((record) => {
      const week = record.week;
      if (!map.has(week)) map.set(week, []);
      map.get(week)!.push(record);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]); // week 오름차순
  }, [sorted]);

  return (
    <section className="mt-12">
      <Text variant="heading" weight="bold" className="text-xl mb-4">
        저장된 분석 기록
      </Text>

      {/* 정렬 탭 */}
      <div className="flex gap-4 mb-6 text-sm">
        <button
          onClick={() => setSortOption('latest')}
          className={`${
            sortOption === 'latest'
              ? 'text-blue-600 font-semibold'
              : 'text-gray-500'
          }`}
        >
          최신순
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => setSortOption('similarity')}
          className={`${
            sortOption === 'similarity'
              ? 'text-blue-600 font-semibold'
              : 'text-gray-500'
          }`}
        >
          유사도 높은 순
        </button>
      </div>

      {/* 주차별 출력 */}
      <div className="space-y-10">
        {groupedByWeek.map(([week, records]) => (
          <div key={week}>
            <div className="text-center text-lg font-semibold text-gray-800 mb-4">
              {week}주차
            </div>
            <div className="grid grid-cols-2 gap-6">
              {records.map((record) => (
                <SavedAnalysisItem key={record.id} record={record} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SavedAnalysisSection;
