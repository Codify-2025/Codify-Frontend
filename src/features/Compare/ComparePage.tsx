// src/features/Compare/ComparePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import Select from '@components/Select';
import Tooltip from '@components/Tooltip';
import { useSelectedFileStore } from '@stores/useSelectedFileStore';

const getLineStyleBySimilarity = (similar: string[]): string => {
  if (similar.length >= 2) return 'bg-red-100'; // 유사한 코드 (다수)
  if (similar.length === 1) return 'bg-green-100'; // 구조 유사 코드 (단일)
  return '';
};

const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const { files, selectedFileA, selectedFileB, setSelectedFiles } =
    useSelectedFileStore();

  if (!selectedFileA || !selectedFileB) {
    return (
      <Layout>
        <div className="px-8 py-10">
          <Text variant="heading" weight="bold" className="text-xl mb-4">
            선택된 파일이 없습니다.
          </Text>
          <Button
            text="결과 페이지로 돌아가기"
            onClick={() => navigate('/result')}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-6 text-base">
        {/* 상단: 이전으로 버튼 */}
        <div className="flex justify-between items-center">
          <Button
            text="이전으로"
            variant="secondary"
            icon={<span className="text-lg">←</span>}
            iconPosition="left"
            onClick={() => navigate('/result')}
          />
        </div>

        {/* 제목 */}
        <Text variant="heading" weight="bold" className="text-3xl text-black">
          {selectedFileA.label} 와 {selectedFileB.label}의 코드 비교
        </Text>

        {/* 파일 선택창 */}
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
                    // 같은 파일 선택 방지 (예외 방어)
                    if (val === other?.id) return;

                    const newFile = files.find((f) => f.id === val);
                    if (!newFile) return;

                    if (idx === 0) {
                      setSelectedFiles(newFile, other);
                    } else {
                      setSelectedFiles(other, newFile);
                    }
                  }}
                />
                <p className="text-sm text-gray-600 mt-1">
                  제출 시간: {file.submittedAt}
                </p>
              </div>
            );
          })}
        </div>

        {/* 코드 비교 뷰어 */}
        <div className="border rounded overflow-hidden mt-6">
          <div className="grid grid-cols-2 text-center font-bold text-lg bg-gray-100 border-b">
            <div className="py-3">{selectedFileA.label}</div>
            <div className="py-3">{selectedFileB.label}</div>
          </div>

          {selectedFileA.content.map((lineA, idx) => {
            const lineB = selectedFileB.content[idx] || '';
            const similarA = selectedFileA.similarMap[idx + 1] || [];
            const similarB = selectedFileB.similarMap[idx + 1] || [];

            return (
              <div key={idx} className="grid grid-cols-2 text-sm border-b">
                {[
                  { line: lineA, similar: similarA },
                  { line: lineB, similar: similarB },
                ].map(({ line, similar }, i) => {
                  const otherFileNames = [
                    selectedFileA.label,
                    selectedFileB.label,
                  ];
                  const filteredSimilar = similar.filter(
                    (name) => !otherFileNames.includes(name)
                  );

                  return (
                    <div
                      key={i}
                      className={`py-2 px-3 ${getLineStyleBySimilarity(filteredSimilar)} border-r ${
                        i === 1 ? 'border-r-0' : ''
                      }`}
                    >
                      <Tooltip
                        content={
                          filteredSimilar.length > 0
                            ? `유사한 다른 제출자: ${filteredSimilar.join(', ')}`
                            : '유사한 제출자 없음'
                        }
                      >
                        <span
                          className={`text-gray-500 mr-2 ${
                            filteredSimilar.length > 0
                              ? 'text-blue-500 font-semibold underline decoration-dotted'
                              : ''
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </Tooltip>
                      {line}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center mt-10 space-x-4">
          <Button
            text="검사 종료하기"
            variant="secondary"
            onClick={() => navigate('/')}
          />
          <Button
            text="결과 저장하기"
            variant="primary"
            onClick={() => {
              navigate('/decision', {
                state: {
                  fileA: selectedFileA,
                  fileB: selectedFileB,
                  similarity: 0.95, // 임시. 나중엔 비교 결과에서 실제 유사도 계산 결과로 대체
                },
              });
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ComparePage;
