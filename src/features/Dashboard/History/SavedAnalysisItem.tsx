import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedAnalysisRecord } from './SavedAnalysisType';
import Text from '@components/Text';
import { formatDateTimeKST, formatPercent01 } from '@utils/format';
import { useSubjectStore } from '@stores/useSubjectStore';

interface Props {
  record: SavedAnalysisRecord;
}

const SavedAnalysisItem: React.FC<Props> = ({ record }) => {
  const navigate = useNavigate();
  const { selectedSubject } = useSubjectStore();
  const subjectId = selectedSubject
    ? String(selectedSubject?.subjectId)
    : undefined;

  if (record.type === 'group') {
    return (
      <div className="flex flex-col items-center">
        <button
          type="button"
          className="h-60 w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow"
          onClick={() => {
            if (!subjectId) return alert('과목을 먼저 선택해 주세요.');
            navigate(`/subjects/${subjectId}/record/${record.id}`);
          }}
        >
          <div className="flex h-full w-full items-center justify-center rounded bg-gray-50 text-gray-400 ring-1 ring-gray-100">
            네트워크 토폴로지 미리보기
          </div>
        </button>
        <p className="mt-2 w-full text-center font-semibold text-gray-600">
          &lt;{record.assignmentName}&gt; 전체 파일 분석 결과
        </p>
      </div>
    );
  }

  // pair
  const similarityText = formatPercent01(record.similarity ?? 0);
  const aTime = formatDateTimeKST(record.fileA.submittedAt);
  const bTime = formatDateTimeKST(record.fileB?.submittedAt || '');
  const bLabel = record.fileB?.label ?? '(미제출)';

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        className="h-60 w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow"
        onClick={() => {
          if (!subjectId) return alert('과목을 먼저 선택해 주세요.');
          navigate(`/subjects/${subjectId}/record/${record.id}`);
        }}
      >
        <div className="text-center">
          <Text variant="body" weight="bold" className="text-xl text-red-600">
            유사도 {similarityText}
          </Text>
        </div>

        <div className="mt-3 flex flex-col gap-2 text-gray-700">
          <div>
            <span className="font-medium">{record.fileA.label}</span>{' '}
            <span className="text-blue-600">{aTime}</span>
          </div>
          <div>
            <span className="font-medium">{bLabel}</span>{' '}
            <span className="text-blue-600">{bTime}</span>
          </div>
        </div>
      </button>

      <p className="mt-2 w-full text-center font-semibold text-gray-600">
        &lt;{record.assignmentName}&gt; {record.fileA.label}-{bLabel} 코드 비교
        결과
      </p>
    </div>
  );
};

export default SavedAnalysisItem;
