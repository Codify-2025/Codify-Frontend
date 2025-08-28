import React from 'react';
import Text from '@components/Text';
import Button from '@components/Button';
import { FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const StepSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-8 px-4 text-center">
      <FiCheckCircle className="text-9xl text-green-500" />
      <Text variant="h2" weight="bold" className="text-gray-900">
        회원가입이 완료되었습니다!
      </Text>
      <Text variant="body" color="muted">
        지금 바로 Codify의 기능을 사용해 보세요.
      </Text>
      <div className="mt-2 flex gap-3">
        <Button
          text="홈으로 가기"
          variant="secondary"
          size="lg"
          onClick={() => navigate('/')}
        />
        <Button
          text="로그인하러 가기"
          variant="primary"
          size="lg"
          onClick={() => navigate('/login')}
        />
      </div>
    </div>
  );
};

export default StepSuccess;
