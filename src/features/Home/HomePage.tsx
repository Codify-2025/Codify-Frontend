import React from 'react';
import { useNavigate } from 'react-router-dom';
import Text from '@components/Text';
import Button from '@components/Button';
import Layout from '@components/Layout';
import { useAuthStore } from '@stores/useAuthStore';
import FeatureGrid from '@components/FeatureGrid';

const HERO_DESC =
  '제출물 간 코드 유사도를 시각화하고, 의심 구간을 빠르게 찾아 분석 시간을 절약하세요.';
const HERO_DESC_WITH_BREAKS = HERO_DESC.replace(/,\s*/g, ',\n');

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout contentClassName="bg-white">
      <div className="min-h-screen">
        {/* ========== HERO (풀블리드 섹션) ========== */}
        <section className="relative z-0 min-h-screen flex items-center">
          {/* 섹션 배경 (전체폭) */}
          <div
            aria-hidden
            className="absolute inset-0 z-0 bg-gradient-to-b from-blue-100 via-white to-transparent"
          />
          {/* 섹션 내부 컨텐츠 컨테이너 */}
          <div className="relative z-10 w-full">
            <div className="mx-auto max-w-7xl px-6 md:px-8 text-center">
              <Text
                as="h1"
                variant="display"
                weight="bold"
                className="!text-5xl md:!text-6xl"
              >
                Codify
              </Text>

              <Text
                variant="body-lg"
                color="muted"
                className="mx-auto mt-6 max-w-3xl !text-xl md:!text-2xl leading-relaxed whitespace-pre-line"
              >
                {HERO_DESC_WITH_BREAKS}
              </Text>

              {/* 혜택 배지 */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4 text-base md:text-lg text-gray-700">
                <span className="rounded-full bg-blue-100/80 px-4 py-1.5 md:px-5 md:py-2 shadow-sm">
                  과제·주차별 관리
                </span>
                <span className="rounded-full bg-blue-100/80 px-4 py-1.5 md:px-5 md:py-2 shadow-sm">
                  유사도 네트워크
                </span>
                <span className="rounded-full bg-blue-100/80 px-4 py-1.5 md:px-5 md:py-2 shadow-sm">
                  코드 비교 뷰어
                </span>
              </div>

              <div className="mt-12 flex justify-center gap-4 md:gap-5">
                <Button
                  text="유사도 분석 시작하기"
                  size="lg"
                  onClick={() => navigate('/assignment/subject')}
                  className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg"
                />
                <Button
                  text="데모 살펴보기"
                  variant="secondary"
                  size="lg"
                  onClick={scrollToFeatures}
                  ariaLabel="기능 미리보기로 이동"
                  className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========== FEATURES (풀블리드 섹션) ========== */}
        <section
          id="features"
          className="relative z-0 min-h-screen flex items-center"
        >
          <div
            aria-hidden
            className="absolute inset-0 z-0 bg-gradient-to-b from-white via-blue-50/80 to-transparent"
          />
          <div className="relative z-10 w-full">
            <div className="mx-auto max-w-7xl px-6 md:px-8">
              <FeatureGrid />
            </div>
          </div>
        </section>

        {/* ========== CTA (풀블리드 섹션) ========== */}
        {!isLoggedIn && (
          <section className="relative z-0 min-h-screen flex items-center">
            <div
              aria-hidden
              className="absolute inset-0 z-0 bg-gradient-to-b from-white via-sky-50/90 to-transparent"
            />
            <div className="relative z-10 w-full">
              <div className="mx-auto max-w-7xl px-6 md:px-8 text-center">
                <Text
                  as="h2"
                  variant="h2"
                  weight="bold"
                  className="!text-4xl md:!text-5xl"
                >
                  지금 바로 Codify를 사용해보세요
                </Text>
                <Text
                  variant="body"
                  color="muted"
                  className="mt-4 mx-auto max-w-2xl !text-lg md:!text-xl"
                >
                  몇 번의 클릭으로 과제별·주차별 유사도를 시각화하고,
                  <br className="hidden md:block" />
                  의심 구간을 빠르게 비교·판별할 수 있어요.
                </Text>
                <div className="mt-10 flex justify-center gap-4 md:gap-5">
                  <Button
                    text="로그인"
                    variant="secondary"
                    onClick={() => navigate('/login')}
                    className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg"
                  />
                  <Button
                    text="회원가입"
                    onClick={() => navigate('/signup')}
                    className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg"
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
