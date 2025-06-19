import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedAnalysisRecord } from './SavedAnalysisType';
import Text from '@components/Text';

interface Props {
  record: SavedAnalysisRecord;
}

const SavedAnalysisItem: React.FC<Props> = ({ record }) => {
  const navigate = useNavigate();

  if (record.type === 'group') {
    return (
      <div className="flex flex-col items-center">
        <div
          className="cursor-pointer border rounded p-4 hover:shadow transition w-full h-64 flex flex-col justify-center"
          onClick={() =>
            navigate(`/result`, {
              state: { fromSaved: true, recordId: record.id },
            })
          }
        >
          <div className="h-full w-full bg-gray-100 rounded flex items-center justify-center text-gray-400">
            네트워크 토폴로지 미리보기
          </div>
        </div>
        <p className="text-center mt-2 text-sm text-gray-600 w-full">
          &lt;{record.assignmentName}&gt; 전체 파일 분석 결과
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="cursor-pointer border rounded p-4 hover:shadow transition w-full h-64 flex flex-col justify-between"
        onClick={() => {
          navigate(`/compare/${record.fileA.label}/${record.fileB.label}`, {
            state: { fromSaved: true, recordId: record.id },
          });
        }}
      >
        {/* 상단: 유사도 표시 */}
        <div className="text-center">
          <Text variant="body" weight="bold" className="text-red-600 text-xl">
            유사도 {record.similarity}%
          </Text>
        </div>

        {/* 중간: 제출 시간 정보 */}
        <div className="flex flex-col items-start gap-2 text-sm text-gray-700">
          <div>
            <span className="font-medium">{record.fileA.label}</span>{' '}
            <span className="text-blue-600">{record.fileA.submittedAt}</span>
          </div>
          <div>
            <span className="font-medium">{record.fileB.label}</span>{' '}
            <span className="text-blue-600">{record.fileB.submittedAt}</span>
          </div>
        </div>

        {/* 하단: 고정된 빈 공간으로 정렬 조정 */}
        <div className="h-4" />
      </div>

      {/* 하단 텍스트 (컨테이너 외부) */}
      <p className="text-center mt-2 text-sm text-gray-600 w-full">
        &lt;{record.assignmentName}&gt; {record.fileA.label}-
        {record.fileB.label} 코드 비교 결과
      </p>
    </div>
  );
};

export default SavedAnalysisItem;
