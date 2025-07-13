import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from ?? '/';
  const fromResultPage = from === 'result' || from === 'compare';
  const fromDashboard = from === '/dashboard';

  const headline = fromResultPage
    ? '로그인하여 분석 결과 저장하기'
    : fromDashboard
      ? '대시보드 이용을 위해 로그인해주세요'
      : '로그인';

  const subtext = fromResultPage
    ? '로그인이 필요한 서비스입니다.'
    : fromDashboard
      ? '분석 기록과 대시보드를 보기 위해 로그인하세요.'
      : '더 많은 서비스를 위해 로그인해주세요.';

  const handleLogin = () => {
    console.log('로그인 시도:', { email, password });
    if (fromResultPage) {
      navigate(-1);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-16 px-6 text-center space-y-10 max-w-xl mx-auto">
        {/* 상단 텍스트 로고 */}
        <Text
          variant="heading"
          weight="bold"
          className="text-4xl sm:text-5xl md:text-6xl text-black border-b-2 border-dashed border-[#E0E0E0] py-4 px-4"
        >
          🚀 Codify
        </Text>

        {/* 안내 텍스트 */}
        <div className="space-y-2">
          <Text variant="heading" weight="bold" className="text-blue-600">
            {headline}
          </Text>
          <p className="text-gray-500 leading-relaxed">{subtext}</p>
        </div>

        {/* 입력 영역 */}
        <div className="w-full space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 입력"
            className="w-full border-b-2 border-gray-300 focus:border-black text-lg py-3 placeholder-gray-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full border-b-2 border-gray-300 focus:border-black text-lg py-3 placeholder-gray-400"
          />
        </div>

        {/* 로그인 버튼 */}
        <Button
          text="로그인"
          onClick={handleLogin}
          size="large"
          className="w-full mt-4"
        />

        {/* 보조 링크 */}
        <div className="space-y-2 text-gray-600">
          <div>
            계정이 없으신가요?{' '}
            <a href="/signup" className="underline font-medium text-blue-600">
              가입하기
            </a>
          </div>
          <div>
            <a
              href="/reset-password"
              className="underline font-medium text-blue-600"
            >
              비밀번호 찾기
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
