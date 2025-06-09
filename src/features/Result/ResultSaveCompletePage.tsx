import React from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ResultSaveCompletePage: React.FC = () => {
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
          결과 저장 완료
        </Text>

        {/* 버튼 2개 */}
        <div className="flex gap-4 mt-4">
          <Button
            text="검사 종료하기"
            variant="secondary"
            onClick={() => navigate('/')}
          />
          <Button
            text="검사 계속하기"
            variant="primary"
            onClick={() => navigate('/result')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ResultSaveCompletePage;
