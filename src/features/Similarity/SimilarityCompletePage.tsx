import React from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SimilarityCompletePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        {/* 체크 아이콘 */}
        <div className="w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center">
          <FiCheck className="text-white text-4xl" />
        </div>

        {/* 텍스트 */}
        <Text variant="heading" weight="bold" className="text-black text-4xl">
          유사도 분석 완료
        </Text>

        {/* 버튼 */}
        <Button
          text="결과 보러 가기"
          variant="primary"
          onClick={() => navigate('/result')} // 추후 구현 예정
        />
      </div>
    </Layout>
  );
};

export default SimilarityCompletePage;
