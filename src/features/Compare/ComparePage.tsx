// src/features/Compare/ComparePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import Select from '@components/Select';
import Tooltip from '@components/Tooltip';
import { useSelectedFileStore } from '@stores/useSelectedFileStore';

const getLineStyle = (line: string) => {
  if (line.includes('유사한 코드')) return 'bg-red-100';
  if (line.includes('구조가 유사한 코드')) return 'bg-green-100';
  return '';
};

console.log('✅ ComparePage 렌더됨');

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
            onClick={() => navigate('/result')}
          />
        </div>

        {/* 제목 */}
        <Text variant="heading" weight="bold" className="text-3xl text-black">
          {selectedFileA.label} 와 {selectedFileB.label}의 코드 비교
        </Text>

        {/* 파일 선택창 */}
        <div className="grid grid-cols-2 gap-8">
          {[selectedFileA, selectedFileB].map((file, idx) => (
            <div key={file.id}>
              <Select
                options={files.map((f) => ({ label: f.label, value: f.id }))}
                value={file.id}
                onChange={(val) => {
                  const newFile = files.find((f) => f.id === val);
                  if (!newFile) return;
                  const other = idx === 0 ? selectedFileB : selectedFileA;
                  if (!other) return;
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
          ))}
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
                ].map(({ line, similar }, i) => (
                  <div
                    key={i}
                    className={`py-2 px-3 ${getLineStyle(line)} border-r ${
                      i === 1 ? 'border-r-0' : ''
                    }`}
                  >
                    <Tooltip
                      content={
                        similar.length > 0
                          ? `유사한 다른 제출자: ${similar.join(', ')}`
                          : '유사한 제출자 없음'
                      }
                    >
                      <span className="text-gray-500 mr-2">{idx + 1}</span>
                    </Tooltip>
                    {line}
                  </div>
                ))}
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
          <Button text="결과 저장하기" variant="primary" />
        </div>
      </div>
    </Layout>
  );
};

export default ComparePage;
