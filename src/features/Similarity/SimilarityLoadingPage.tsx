import React, { useEffect } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import { useNavigate } from 'react-router-dom';

const SimilarityLoadingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/analysis/complete');
    }, 3000); // 3초 후 이동

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        {/* 로딩 스피너 */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-black/10" />
          <div className="absolute inset-0 rounded-full border-t-4 border-green-400 animate-spin shadow-green-300" />
        </div>

        {/* 텍스트 */}
        <Text variant="heading" weight="bold" className="text-black text-4xl">
          유사도 분석 진행 중
        </Text>
      </div>
    </Layout>
  );
};

export default SimilarityLoadingPage;
