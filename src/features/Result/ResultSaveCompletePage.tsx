import React from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ResultSaveCompletePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-10 px-4 text-center">
        {/* 아이콘 */}
        <FiCheckCircle className="text-blue-500 text-9xl" />

        {/* 완료 텍스트 */}
        <Text
          variant="heading"
          weight="bold"
          className="text-4xl text-gray-800"
        >
          결과가 성공적으로 저장되었습니다!
        </Text>

        {/* 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Button
            text="검사 종료하기"
            variant="secondary"
            size="large"
            onClick={() => navigate('/')}
          />
          <Button
            text="검사 계속하기"
            variant="primary"
            size="large"
            onClick={() => navigate('/result')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ResultSaveCompletePage;
