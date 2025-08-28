import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';

type LoginLocationState = { from?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPw, setTouchedPw] = useState(false);

  const from = (location.state as LoginLocationState)?.from ?? '/';
  const fromResultPage = from === 'result' || from === 'compare';
  const fromDashboard = from === '/dashboard';

  const headline = useMemo(() => {
    if (fromResultPage) return '로그인하여 분석 결과 저장하기';
    if (fromDashboard) return '대시보드 이용을 위해 로그인해 주세요';
    return '로그인';
  }, [fromResultPage, fromDashboard]);

  const subtext = useMemo(() => {
    if (fromResultPage) return '로그인이 필요한 서비스입니다.';
    if (fromDashboard) return '분석 기록과 대시보드를 보기 위해 로그인하세요.';
    return '더 많은 서비스를 위해 로그인해 주세요.';
  }, [fromResultPage, fromDashboard]);

  const emailValid = EMAIL_RE.test(email);
  const pwValid = password.length > 0;
  const formValid = emailValid && pwValid;

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formValid) return;
    // 실제 로그인 로직 연결 지점
    if (fromResultPage) {
      navigate(-1);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <Layout>
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-12">
        {/* 로고 */}
        <div className="mb-8">
          <Text variant="display" weight="bold" className="text-gray-900">
            🚀 Codify
          </Text>
        </div>

        {/* 카드 */}
        <div className="w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          {/* 헤더 */}
          <div className="mb-6 space-y-2 text-center">
            <Text variant="h2" weight="bold" className="text-gray-900">
              {headline}
            </Text>
            <Text variant="caption" color="muted">
              {subtext}
            </Text>
          </div>

          {/* 폼 */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* 이메일 */}
            <div>
              <label
                className="mb-1 block text-sm text-gray-700"
                htmlFor="email"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onBlur={() => setTouchedEmail(true)}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-invalid={touchedEmail && !emailValid}
                className={[
                  'w-full rounded-lg border bg-transparent px-3 py-2 text-base outline-none transition-colors',
                  touchedEmail && !emailValid
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-300 focus:border-gray-900',
                ].join(' ')}
              />
              {touchedEmail && !emailValid && (
                <p className="mt-1 text-sm text-red-600">
                  올바른 이메일 주소를 입력해 주세요.
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label
                className="mb-1 block text-sm text-gray-700"
                htmlFor="password"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onBlur={() => setTouchedPw(true)}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  aria-invalid={touchedPw && !pwValid}
                  className={[
                    'w-full rounded-lg border bg-transparent px-3 py-2 pr-10 text-base outline-none transition-colors',
                    touchedPw && !pwValid
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-300 focus:border-gray-900',
                  ].join(' ')}
                />
                <button
                  type="button"
                  aria-label="비밀번호 보기 전환"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {touchedPw && !pwValid && (
                <p className="mt-1 text-sm text-red-600">
                  비밀번호를 입력해 주세요.
                </p>
              )}
            </div>

            {/* 로그인 버튼 */}
            <Button
              text="로그인"
              size="lg"
              className="mt-2 w-full"
              onClick={() => handleLogin()}
              disabled={!formValid}
            />
          </form>

          {/* 보조 링크 */}
          <div className="mt-6 space-y-2 text-center text-sm text-gray-600">
            <div>
              계정이 없으신가요?{' '}
              <Link
                to="/signup"
                className="font-medium text-blue-600 underline"
              >
                가입하기
              </Link>
            </div>
            <div>
              <Link
                to="/reset-password"
                className="font-medium text-blue-600 underline"
              >
                비밀번호 찾기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
