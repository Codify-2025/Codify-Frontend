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
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        {/* 완료 아이콘 */}
        <div className="rounded-full bg-blue-50 p-6">
          <FiCheckCircle className="text-6xl text-blue-600 animate-[pop_300ms_ease-out]" />
        </div>

        {/* 텍스트 */}
        <div className="mt-6 space-y-2">
          <Text variant="h2" weight="bold" className="text-gray-900">
            유사도 분석이 완료되었습니다!
          </Text>
          <Text variant="body" className="text-gray-600">
            네트워크 그래프와 유사 쌍 비교가 준비됐어요.
          </Text>
        </div>

        {/* 액션 버튼 */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            text="결과 보러 가기"
            variant="primary"
            size="lg"
            onClick={() => navigate('/result')}
          />
          <Button
            text="대시보드로 이동"
            variant="secondary"
            size="lg"
            onClick={() => navigate('/dashboard')}
          />
        </div>
      </div>

      {/* 간단한 팝 애니메이션 */}
      <style>{`
        @keyframes pop {
          0% { transform: scale(.8); opacity: .0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </Layout>
  );
};

export default SimilarityCompletePage;
