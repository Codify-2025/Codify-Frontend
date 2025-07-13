import React from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SimilarityCompletePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-10 px-4 text-center">
        {/* 아이콘 영역 */}
        <FiCheckCircle className="text-blue-500 text-9xl" />

        {/* 완료 텍스트 */}
        <Text
          variant="heading"
          weight="bold"
          className="text-4xl text-gray-800"
        >
          유사도 분석이 완료되었습니다!
        </Text>

        {/* 버튼 */}
        <Button
          text="결과 보러 가기"
          variant="primary"
          size="large"
          onClick={() => navigate('/result')}
        />
      </div>
    </Layout>
  );
};

export default SimilarityCompletePage;
