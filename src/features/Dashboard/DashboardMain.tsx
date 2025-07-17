import React from 'react';
import Text from '@components/Text';
import { useSubjectStore } from '@stores/useSubjectStore';
import AccumulatedSimilarityGraph from './AccumulatedSimilarityGraph';
import SavedAnalysisSection from './History/SavedAnalysisSection';
import { useEffect } from 'react';
import { dummySavedRecords } from '@constants/dummySavedRecords';
import { useSavedRecordStore } from '@stores/useSavedRecordStore';

const DashboardMain: React.FC = () => {
  const { selectedSubject } = useSubjectStore();

  useEffect(() => {
    useSavedRecordStore.getState().setRecords(dummySavedRecords);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      {!selectedSubject ? (
        <div className="flex items-center justify-center h-64">
          <Text variant="subtitle" weight="medium">
            과목 선택 시 해당 과목의 유사도 분석 기록을 확인할 수 있습니다.
          </Text>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 상단 과목 정보 영역 */}
          <div className="bg-blue-50 w-full rounded-xl p-6 text-center">
            <Text variant="subtitle" weight="bold" color="gray">
              <span className="text-primary">{selectedSubject.name}</span>
            </Text>
          </div>

          {/* 누적 네트워크 토폴로지 */}
          <section>
            <Text variant="heading" weight="bold" className="mb-4">
              누적 네트워크 토폴로지
            </Text>
            <AccumulatedSimilarityGraph />
          </section>

          {/* 저장된 분석 기록 */}
          <section>
            <SavedAnalysisSection />
          </section>
        </div>
      )}
    </div>
  );
};

export default DashboardMain;
