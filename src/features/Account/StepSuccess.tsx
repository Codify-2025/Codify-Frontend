import React from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const StepSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
      {/* 체크 아이콘 */}
      <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center">
        <FiCheck className="text-white text-4xl" />
      </div>

      {/* 텍스트 */}
      <Text
        variant="heading"
        weight="bold"
        className="text-black text-3xl text-center"
      >
        회원가입이 완료되었습니다!
      </Text>
      <Text variant="body" className="text-gray-600 text-center">
        지금 바로 Codify의 기능을 사용해보세요.
      </Text>

      {/* 버튼 */}
      <div className="flex gap-4 mt-4">
        <Button
          text="홈으로 가기"
          variant="secondary"
          onClick={() => navigate('/')}
        />
        <Button
          text="로그인하러 가기"
          variant="primary"
          onClick={() => navigate('/login')}
        />
      </div>
    </div>
  );
};

export default StepSuccess;
