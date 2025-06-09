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

    if (isPlagiarism) {
      navigate('/result/save'); // 저장 완료 화면으로 이동
    } else {
      navigate('/result'); // 그냥 결과 화면으로 복귀
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-10 py-20 space-y-16">
        {/* 제목 */}
        <Text
          variant="heading"
          weight="bold"
          className="text-4xl leading-relaxed"
        >
          <span className="text-blue-500">{fileA.label}</span>과{' '}
          <span className="text-blue-500">{fileB.label}</span>를<br />
          <span className="text-red-500">표절</span>로 판단하시겠습니까?
        </Text>

        {/* 유사도 + 제출 시간 */}
        <div className="flex justify-between items-start">
          <div>
            <Text variant="caption" color="gray" className="text-lg">
              유사도
            </Text>
            <Text
              variant="heading"
              weight="bold"
              className="text-red-500 text-5xl"
            >
              {(similarity * 100).toFixed(0)}%
            </Text>
          </div>

          <div>
            <Text variant="caption" color="gray" className="text-lg">
              제출 시간
            </Text>
            <div className="mt-2 space-y-2 text-base">
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
            onClick={() => handleDecision(false)}
          />
          <Button
            text="표절로 저장"
            variant="danger"
            onClick={() => handleDecision(true)}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PlagiarismDecisionPage;
