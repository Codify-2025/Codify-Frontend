import React from 'react';
import Text from '@components/Text';
import Button from '@components/Button';
import { FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const StepSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-10 px-4 text-center">
      {/* 아이콘 영역 */}
      <FiCheckCircle className="text-green-500 text-9xl" />

      {/* 완료 텍스트 */}
      <Text variant="heading" weight="bold" className="text-4xl text-gray-800">
        회원가입이 완료되었습니다!
      </Text>

      {/* 부가 설명 */}
      <Text variant="body" className="text-gray-600">
        지금 바로 Codify의 기능을 사용해보세요.
      </Text>

      {/* 버튼 */}
      <div className="flex gap-4 mt-2">
        <Button
          text="홈으로 가기"
          variant="secondary"
          size="large"
          onClick={() => navigate('/')}
        />
        <Button
          text="로그인하러 가기"
          variant="primary"
          size="large"
          onClick={() => navigate('/login')}
        />
      </div>
    </div>
  );
};

export default StepSuccess;
