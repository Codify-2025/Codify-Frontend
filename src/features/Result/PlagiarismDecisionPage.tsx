import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useDecisionStore } from '@stores/useDecisionStore';

const PlagiarismDecisionPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { saveDecision } = useDecisionStore();

  if (!state?.fileA || !state?.fileB) {
    return (
      <Layout>
        <div className="px-8 py-10">
          <Text variant="heading" weight="bold" className="text-xl mb-4">
            파일 정보가 존재하지 않습니다.
          </Text>
          <Button
            text="결과 페이지로 이동"
            onClick={() => navigate('/result')}
          />
        </div>
      </Layout>
    );
  }

  const { fileA, fileB, similarity } = state;

  const handleDecision = (isPlagiarism: boolean) => {
    console.log('판단 결과:', isPlagiarism ? '표절' : '표절 아님');
    saveDecision({
      fileAId: fileA.id,
      fileBId: fileB.id,
      isPlagiarism,
    });
    navigate('/result/save'); // 판단 후 결과 저장 완료 페이지로 이동
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-10 py-20 space-y-16">
        {/* 제목 */}
        <div className="space-y-4">
          <Text variant="heading" weight="bold" className="text-4xl">
            <span className="text-blue-500">{fileA.label}</span>과{' '}
            <span className="text-blue-500">{fileB.label}</span>를
          </Text>
          <Text
            variant="heading"
            weight="bold"
            className="text-4xl text-red-500"
          >
            표절로 판단하시겠습니까?
          </Text>
        </div>

        {/* 유사도 + 제출 시간 */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <Text variant="body" color="gray" className="text-lg">
              유사도
            </Text>
            <Text variant="heading" weight="bold" color="danger">
              {(similarity * 100).toFixed(0)}%
            </Text>
          </div>

          <div className="flex flex-col gap-1">
            <Text variant="body" color="gray">
              제출 시간
            </Text>
            <div className="mt-2 space-y-2 text-lg">
              <div>
                <span className="font-bold mr-2">{fileA.label}</span>
                <span className="text-blue-500">{fileA.submittedAt}</span>
              </div>
              <div>
                <span className="font-bold mr-2">{fileB.label}</span>
                <span className="text-blue-500">{fileB.submittedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 코드 비교 다시 보기 */}
        <div
          className="underline text-base cursor-pointer w-fit"
          onClick={() => navigate(-1)}
        >
          코드 비교 다시 보기
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center gap-8 pt-12">
          <Button
            text="표절 아님"
            variant="secondary"
            size="large"
            onClick={() => handleDecision(false)}
          />
          <Button
            text="표절로 저장"
            variant="danger"
            size="large"
            onClick={() => handleDecision(true)}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PlagiarismDecisionPage;
