import React, { useMemo, useState } from 'react';
import Text from '@components/Text';
import { savedAnalysisRecords } from './SavedAnalysisDummy';
import { SavedAnalysisRecord } from './SavedAnalysisType';
import SavedAnalysisItem from './SavedAnalysisItem';

type SortOption = 'latest' | 'similarity';

const SavedAnalysisSection: React.FC = () => {
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [search, setSearch] = useState('');

  // 정렬
  const sorted = useMemo(() => {
    const list = [...savedAnalysisRecords];
    if (sortOption === 'similarity') {
      return list.sort((a, b) => {
        if (a.type !== 'pair') return 1;
        if (b.type !== 'pair') return -1;
        return b.similarity - a.similarity;
      });
    }
    return list.sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
  }, [sortOption]);

  // 검색
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((r) => {
      const base =
        `${r.assignmentName} ${'fileA' in r ? r.fileA.label : ''} ${'fileB' in r ? r.fileB.label : ''}`.toLowerCase();
      return base.includes(q);
    });
  }, [sorted, search]);

  // 주차 그룹
  const groupedByWeek = useMemo(() => {
    const map = new Map<number, SavedAnalysisRecord[]>();
    filtered.forEach((r) => {
      if (!map.has(r.week)) map.set(r.week, []);
      map.get(r.week)!.push(r);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [filtered]);

  return (
    <section className="mt-10">
      <Text variant="h2" weight="bold" className="mb-3 text-gray-900">
        저장된 분석 기록
      </Text>

      {/* 컨트롤 바 */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex overflow-hidden rounded-lg border">
          <button
            className={[
              'px-4 py-2 text-sm transition',
              sortOption === 'latest'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700',
            ].join(' ')}
            onClick={() => setSortOption('latest')}
          >
            최신순
          </button>
          <button
            className={[
              'border-l px-4 py-2 text-sm transition',
              sortOption === 'similarity'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700',
            ].join(' ')}
            onClick={() => setSortOption('similarity')}
          >
            유사도 높은 순
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="과제/학생/주차 검색"
            className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-9 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* 목록 */}
      <div className="space-y-10">
        {groupedByWeek.map(([week, records]) => (
          <div key={week}>
            <div className="rounded-md bg-blue-50 py-2 text-center text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
              {week}주차
            </div>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {records.map((r) => (
                <SavedAnalysisItem key={r.id} record={r} />
              ))}
            </div>
          </div>
        ))}
        {groupedByWeek.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
};

export default SavedAnalysisSection;
