import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import Select from '@components/Select';
import Tooltip from '@components/Tooltip';
import { FiArrowLeft } from 'react-icons/fi';
import { useSelectedFileStore } from '@stores/useSelectedFileStore';
import { useSavedRecordStore } from '@stores/useSavedRecordStore';
import { useAuthStore } from '@stores/useAuthStore';

// 유사도에 따른 줄 배경색
const getLineStyleBySimilarity = (similar: string[]): string => {
  if (similar.length >= 2) return 'bg-red-50';
  if (similar.length === 1) return 'bg-green-50';
  return '';
};

// 한 줄 코드 비교 (좌/우 두 칸)
const CompareLineRow: React.FC<{
  idx: number;
  lineA: string;
  lineB: string;
  similarA: string[];
  similarB: string[];
  fileLabels: string[];
}> = ({ idx, lineA, lineB, similarA, similarB, fileLabels }) => {
  const cells = [
    { line: lineA, similar: similarA },
    { line: lineB, similar: similarB },
  ];
  return (
    <div className="grid grid-cols-2 text-sm border-b last:border-b-0">
      {cells.map(({ line, similar }, i) => {
        const filtered = similar.filter((name) => !fileLabels.includes(name));
        const has = filtered.length > 0;
        return (
          <div
            key={i}
            className={[
              'py-2 px-3',
              'border-r',
              i === 1 ? 'border-r-0' : 'border-r-gray-100',
              getLineStyleBySimilarity(filtered),
            ].join(' ')}
          >
            <Tooltip
              content={
                has
                  ? `유사한 다른 제출자: ${filtered.join(', ')}`
                  : '유사한 제출자 없음'
              }
            >
              <span
                className={[
                  'mr-2 select-none text-xs',
                  has
                    ? 'text-blue-600 underline decoration-dotted'
                    : 'text-gray-400',
                ].join(' ')}
              >
                {idx + 1}
              </span>
            </Tooltip>
            <span className="font-mono text-gray-800 whitespace-pre-wrap break-words">
              {line || ' '}
            </span>
          </div>
        );
      })}
    </div>
  );
};

type PairState = {
  fileA: {
    id: string;
    label: string;
    submittedAt: string;
    content: string[];
    similarMap: Record<number, string[]>;
  };
  fileB: {
    id: string;
    label: string;
    submittedAt: string;
    content: string[];
    similarMap: Record<number, string[]>;
  };
  similarity?: number;
  fromSaved?: boolean;
  recordId?: string | number;
};

const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { files, selectedFileA, selectedFileB, setSelectedFiles } =
    useSelectedFileStore();
  const { isLoggedIn } = useAuthStore();

  const fromSaved = (location.state as PairState | undefined)?.fromSaved;
  const recordId = (location.state as PairState | undefined)?.recordId;

  // 저장본에서 진입 시 선택 복원
  useEffect(() => {
    if (fromSaved && recordId != null) {
      useSavedRecordStore.getState().selectRecordById(String(recordId));
      const selected = useSavedRecordStore.getState().selectedRecord;
      if (selected && selected.type === 'pair' && selected.fileB) {
        setSelectedFiles(selected.fileA, selected.fileB);
      }
    }
  }, [fromSaved, recordId, setSelectedFiles]);

  if (!selectedFileA || !selectedFileB) {
    return (
      <Layout>
        <div className="px-8 py-10">
          <Text variant="heading" weight="bold" className="mb-4 text-xl">
            선택된 파일이 없습니다.
          </Text>
          <Button
            text="결과 페이지로 돌아가기"
            variant="primary"
            onClick={() => navigate('/result')}
          />
        </div>
      </Layout>
    );
  }

  const handleSave = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: 'result' } });
    } else {
      navigate('/decision', {
        state: {
          fileA: selectedFileA,
          fileB: selectedFileB,
          similarity: 0.95, // TODO: 실제 유사도로 교체
        },
      });
    }
  };

  const fileLabels = [selectedFileA.label, selectedFileB.label];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-6 text-base">
        {/* 상단 */}
        <div className="flex items-center justify-between">
          <Button
            text="이전으로"
            variant="secondary"
            size="lg"
            icon={<FiArrowLeft size={18} />}
            iconPosition="left"
            onClick={() => navigate(-1)}
          />
        </div>

        {/* 제목 */}
        <Text variant="heading" weight="bold" className="text-3xl text-black">
          {selectedFileA.label} 와 {selectedFileB.label}의 코드 비교
        </Text>

        {/* 파일 선택 */}
        <div className="grid grid-cols-2 gap-8">
          {[selectedFileA, selectedFileB].map((file, idx) => {
            const other = idx === 0 ? selectedFileB : selectedFileA;
            const options = files
              .filter((f) => f.id !== other?.id)
              .map((f) => ({ label: f.label, value: f.id }));

            return (
              <div key={file.id}>
                <Select
                  options={options}
                  value={file.id}
                  onChange={(val) => {
                    if (val === other?.id) return;
                    const newFile = files.find((f) => f.id === val);
                    if (!newFile) return;
                    if (idx === 0) setSelectedFiles(newFile, other);
                    else setSelectedFiles(other, newFile);
                  }}
                />
                <p className="mt-1 text-sm text-gray-600">
                  제출 시간: {file.submittedAt}
                </p>
              </div>
            );
          })}
        </div>

        {/* 코드 비교 뷰어: 한 줄 = 두 칸 */}
        <div className="mt-6 overflow-hidden rounded border">
          <div className="grid grid-cols-2 border-b bg-gray-100 text-center font-bold text-lg">
            <div className="py-3">{selectedFileA.label}</div>
            <div className="py-3">{selectedFileB.label}</div>
          </div>

          {selectedFileA.content.map((lineA, idx) => (
            <CompareLineRow
              key={idx}
              idx={idx}
              lineA={lineA}
              lineB={selectedFileB.content[idx] || ''}
              similarA={selectedFileA.similarMap[idx + 1] || []}
              similarB={selectedFileB.similarMap[idx + 1] || []}
              fileLabels={fileLabels}
            />
          ))}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-10 flex justify-center gap-4">
          <Button
            text="검사 종료하기"
            variant="secondary"
            size="lg"
            onClick={() => navigate('/')}
          />
          <Button
            text="결과 저장하기"
            variant="primary"
            size="lg"
            onClick={handleSave}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ComparePage;
