import React from 'react';
import { useNavigate } from 'react-router-dom';
import Text from '@components/Text';
import Button from '@components/Button';
import Layout from '@components/Layout';
import { useAuthStore } from '@stores/useAuthStore';
import FeatureGrid from '@components/FeatureGrid';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout contentClassName="bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl px-6 py-20 space-y-24">
          {/* Hero */}
          <section className="text-center space-y-6">
            <Text as="h1" variant="display" weight="bold">
              Codify
            </Text>
            <Text variant="body-lg" color="muted" className="mx-auto max-w-2xl">
              제출물 간 코드 유사도를 시각화하고, 의심 구간을 빠르게 찾아
              <span className="whitespace-nowrap"> 분석 시간을 절약</span>
              하세요.
            </Text>

            {/* 혜택 배지 */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
              <span className="rounded-full bg-blue-50 px-3 py-1">
                과제·주차별 관리
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1">
                유사도 네트워크
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1">
                코드 비교 뷰어
              </span>
            </div>

            <div className="mt-8 flex justify-center gap-3">
              <Button
                text="유사도 분석 시작하기"
                size="lg"
                onClick={() => navigate('/assignment/subject')}
              />
              {/* 데모 살펴보기: 기본은 아래 Feature로 스크롤 (원하면 /demo로 교체 가능) */}
              <Button
                text="데모 살펴보기"
                variant="secondary"
                size="lg"
                onClick={scrollToFeatures}
                ariaLabel="기능 미리보기로 이동"
              />
              {/*
                데모 라우트를 사용할 경우:
                onClick={() => navigate('/demo')}
              */}
            </div>
          </section>

          {/* Features */}
          <FeatureGrid />

          {/* CTA 하단 */}
          {!isLoggedIn && (
            <section className="text-center space-y-4">
              <Text as="h2" variant="h2" weight="bold">
                지금 바로 Codify를 사용해보세요
              </Text>
              <div className="flex justify-center gap-3">
                <Button
                  text="로그인"
                  variant="secondary"
                  onClick={() => navigate('/login')}
                />
                <Button text="회원가입" onClick={() => navigate('/signup')} />
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
