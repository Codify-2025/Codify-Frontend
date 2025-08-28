import React, { useEffect } from 'react';
import Text from '@components/Text';
import { useSubjectStore } from '@stores/useSubjectStore';
import AccumulatedSimilarityGraph from './AccumulatedSimilarityGraph';
import SavedAnalysisSection from './History/SavedAnalysisSection';
import { dummySavedRecords } from '@constants/dummySavedRecords';
import { useSavedRecordStore } from '@stores/useSavedRecordStore';

const DashboardMain: React.FC = () => {
  const { selectedSubject } = useSubjectStore();

  useEffect(() => {
    useSavedRecordStore.getState().setRecords(dummySavedRecords);
  }, []);

  if (!selectedSubject) {
    return (
      <div className="py-16">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Text variant="h3" weight="bold" className="text-gray-900">
            과목을 선택해 주세요
          </Text>
          <Text variant="body" className="mt-2 text-gray-600">
            과목을 선택하면 해당 과목의 누적 네트워크와 저장된 분석 기록을
            확인할 수 있어요.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <main className="py-8">
      {/* 상단 과목 배지 */}
      <div className="mb-6 rounded-xl bg-blue-50 p-4 text-center ring-1 ring-blue-100">
        <Text variant="body" weight="bold">
          <span className="text-primary">{selectedSubject.name}</span>
        </Text>
      </div>

      {/* 누적 네트워크 토폴로지 */}
      <section className="mb-10">
        <Text variant="h2" weight="bold" className="mb-3 text-gray-900">
          누적 네트워크 토폴로지
        </Text>
        <AccumulatedSimilarityGraph />
      </section>

      {/* 저장된 분석 기록 */}
      <section>
        <SavedAnalysisSection />
      </section>
    </main>
  );
};

export default DashboardMain;
