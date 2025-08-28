import React from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { FiCheckCircle, FiHome, FiRepeat } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ResultSaveCompletePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex min-h-[68vh] flex-col items-center justify-center px-6 text-center">
        {/* 아이콘 */}
        <div className="mb-6 rounded-full bg-blue-50 p-5 text-blue-600 shadow-sm">
          <FiCheckCircle className="h-16 w-16" />
        </div>

        {/* 텍스트 */}
        <Text variant="h2" weight="bold" className="text-gray-900">
          결과가 성공적으로 저장되었습니다!
        </Text>
        <Text variant="caption" color="muted" className="mt-2">
          저장된 결과는 대시보드 &gt; 기록에서 다시 확인할 수 있어요.
        </Text>

        {/* 버튼 그룹 */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            text="검사 종료하기"
            variant="secondary"
            size="lg"
            icon={<FiHome aria-hidden="true" focusable="false" />}
            onClick={() => navigate('/')}
          />
          <Button
            text="검사 계속하기"
            variant="primary"
            size="lg"
            icon={<FiRepeat aria-hidden="true" focusable="false" />}
            onClick={() => navigate('/result')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ResultSaveCompletePage;
