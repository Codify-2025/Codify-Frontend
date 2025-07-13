import React, { useMemo, useState } from 'react';
import Text from '@components/Text';
import { savedAnalysisRecords } from './SavedAnalysisDummy';
import { SavedAnalysisRecord } from './SavedAnalysisType';
import SavedAnalysisItem from './SavedAnalysisItem';

type SortOption = 'latest' | 'similarity';

const SavedAnalysisSection: React.FC = () => {
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [search, setSearch] = useState('');

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

  // 검색어 필터링
  const filtered = useMemo(() => {
    return sorted.filter((record) => {
      const lower = search.toLowerCase();
      const target =
        `${record.assignmentName} ${'fileA' in record ? record.fileA.label : ''} ${'fileB' in record ? record.fileB.label : ''}`.toLowerCase();
      return target.includes(lower);
    });
  }, [sorted, search]);

  // 주차별로 그룹핑
  const groupedByWeek = useMemo(() => {
    const map = new Map<number, SavedAnalysisRecord[]>();
    filtered.forEach((record) => {
      const week = record.week;
      if (!map.has(week)) map.set(week, []);
      map.get(week)!.push(record);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]); // week 오름차순
  }, [filtered]);

  return (
    <section className="mt-12">
      <Text variant="heading" weight="bold" className="mb-4">
        저장된 분석 기록
      </Text>

      {/* 정렬 & 검색 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 text-lg">
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

        {/* 검색 입력창 */}
        <div className="relative w-60">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="과제/학생/주차별로 검색하기"
            className="p-1 w-full pr-8 border-0 border-b border-gray-400 focus:outline-none focus:ring-0 focus:border-black placeholder-gray-400"
          />
          <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500">
            🔍
          </span>
        </div>
      </div>

      {/* 주차별 출력 */}
      <div className="space-y-12 py-6">
        {groupedByWeek.map(([week, records]) => (
          <div key={week}>
            <div className="text-center text-lg font-semibold text-gray mb-4 rounded-md py-2 bg-blue-100">
              {week}주차
            </div>
            <div className="grid grid-cols-2 gap-6">
              {records.map((record) => (
                <SavedAnalysisItem key={record.id} record={record} />
              ))}
            </div>
          </div>
        ))}
        {groupedByWeek.length === 0 && (
          <div className="text-center text-lg font-medium text-gray-400 py-20">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
};

export default SavedAnalysisSection;
