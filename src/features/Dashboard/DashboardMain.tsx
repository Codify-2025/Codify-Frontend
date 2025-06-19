import React from 'react';
import Text from '@components/Text';
import { useSubjectStore } from '@stores/subjectStore';

const DashboardMain: React.FC = () => {
  const { selectedSubject } = useSubjectStore();

  return (
    <div className="max-w-7xl mx-auto px-8 py-4">
      {!selectedSubject ? (
        // 과목 미선택 시 안내 텍스트
        <div className="flex items-center justify-center h-64">
          <Text
            variant="heading"
            weight="bold"
            className="text-xl text-gray-500 text-center"
          >
            과목 선택 시 해당 과목의 유사도 분석 기록을 확인할 수 있습니다.
          </Text>
        </div>
      ) : (
        // 과목 선택 시 콘텐츠 표시
        <div className="space-y-4">
          {/* 선택된 과목명 상단 표시 */}
          <div className="text-lg text-gray-700 font-semibold text-center">
            선택된 과목:{' '}
            <span className="text-blue-600">{selectedSubject.name}</span>
          </div>

          {/* 누적 네트워크 토폴로지 */}
          <section>
            <Text variant="heading" weight="bold" className="text-lg mb-4">
              누적 네트워크 토폴로지
            </Text>
            <div className="h-64 border rounded-lg flex items-center justify-center text-gray-400">
              (Network Graph Placeholder for {selectedSubject.name})
            </div>
          </section>

          {/* 저장된 분석 기록 */}
          <section>
            <Text variant="heading" weight="bold" className="text-lg mb-4">
              저장된 분석 기록
            </Text>
            <div className="h-48 border rounded-lg flex items-center justify-center text-gray-400">
              (Saved Analysis Placeholder for {selectedSubject.name})
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default DashboardMain;
