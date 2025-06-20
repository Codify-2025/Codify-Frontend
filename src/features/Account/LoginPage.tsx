import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Text from '@components/Text';
import Button from '@components/Button';
import Layout from '@components/Layout';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // ResultPage, Dashboard 등에서 넘어온 경우 구분
  const from = location.state?.from ?? '/';
  const fromResultPage = from === 'result' || from === 'compare';
  const fromDashboard = from === '/dashboard';

  // 상황별 문구 지정
  const headline = fromResultPage
    ? '로그인하여 분석 결과 저장하기'
    : fromDashboard
      ? '대시보드 이용을 위해 로그인해주세요'
      : 'Codify 로그인';

  const subtext = fromResultPage
    ? '로그인이 필요한 서비스입니다.'
    : fromDashboard
      ? '분석 기록과 대시보드를 보기 위해 로그인하세요.'
      : '더 많은 서비스를 위해 로그인해주세요.';

  const handleLogin = () => {
    console.log('로그인 시도:', { email, password });

    // 로그인 성공 시 원래 경로로 이동
    if (fromResultPage) {
      navigate(-1); // Result 또는 Compare 페이지로
    } else {
      navigate(from, { replace: true }); // 대시보드 or 홈 등
    }

    // TODO: 실제 로그인 API 연동
  };

  return (
    <Layout>
      <div className="flex h-screen">
        {/* 좌측: 로그인 폼 */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 space-y-5">
          <Text variant="body" className="text-lg text-gray-700">
            {subtext}
          </Text>
          <Text variant="heading" weight="bold" className="text-3xl text-black">
            {headline}
          </Text>

          <input
            type="email"
            placeholder="이메일을 입력하세요"
            className="w-full max-w-sm border border-gray-300 rounded px-4 py-3 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="w-full max-w-sm border border-gray-300 rounded px-4 py-3 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            text="계속"
            onClick={handleLogin}
            className="w-full max-w-sm mt-2 bg-black text-white"
          />

          <div className="my-3 w-full max-w-sm border-t" />

          <div className="text-xs text-gray-600 text-center space-y-2">
            <div>
              계정이 없으신가요?{' '}
              <a href="/signup" className="underline font-medium">
                가입하기
              </a>
            </div>
            <div>
              <a href="/reset-password" className="underline font-medium">
                비밀번호 찾기
              </a>
            </div>
          </div>
        </div>

        {/* 우측: 이미지 영역 */}
        <div className="hidden md:flex flex-1 justify-center items-center bg-white">
          <img
            src="/login-visual.png"
            alt="login visual"
            className="max-w-md"
          />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
