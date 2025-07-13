import React, { useEffect } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import { useNavigate } from 'react-router-dom';

const SimilarityLoadingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/analysis/complete');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-10 px-4 text-center">
        {/* 로딩 스피너 */}
        <div className="relative w-28 h-28 drop-shadow-lg">
          <div className="absolute inset-0 rounded-full border-4 border-black/10" />
          <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin" />
        </div>

        {/* 메인 텍스트 */}
        <Text
          variant="heading"
          weight="bold"
          className="text-4xl text-gray-800"
        >
          유사도 분석 중입니다...
        </Text>

        {/* 서브 텍스트 */}
        <Text variant="body" weight="regular" className="text-gray-500">
          제출한 파일들을 분석하여 결과를 생성 중입니다.
        </Text>
      </div>
    </Layout>
  );
};

export default SimilarityLoadingPage;
