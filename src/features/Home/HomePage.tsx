import React from 'react';
import { useNavigate } from 'react-router-dom';
import Text from '@components/Text';
import Button from '@components/Button';
import Layout from '@components/Layout';
import { useAuthStore } from '@stores/useAuthStore';
import FeatureSlider from '@components/FeatureSlider';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <Layout contentClassName="bg-gradient-to-b from-blue-100 via-white to-white">
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-20 space-y-40">
          {/* Hero Section */}
          <section className="text-center space-y-10 sm:space-y-14">
            <Text
              variant="heading"
              weight="bold"
              className="text-4xl sm:text-5xl md:text-6xl text-black"
            >
              🚀 Codify
            </Text>
            <Text variant="body" weight="medium">
              제출된 코드 간 유사도를 시각화하고
              <br />
              표절 가능성을 쉽게 파악할 수 있는 스마트한 분석 도구입니다.
            </Text>
            <div className="mt-10 flex justify-center">
              <Button
                text="유사도 분석 시작하기"
                variant="primary"
                className="text-lg font-semibold px-12 py-4 text-white text-2xl !rounded-full shadow-lg"
                onClick={() => navigate('/assignment/subject')}
              />
            </div>
          </section>

          {/* 기능 소개 Section */}
          <FeatureSlider />

          {/* Call to Action */}
          {!isLoggedIn && (
            <section className="text-center space-y-5 sm:space-y-10">
              <Text variant="heading" weight="bold" className="text-xl mb-2">
                지금 바로 Codify를 사용해보세요
              </Text>
              <div className="flex justify-center gap-4 mt-4">
                <Button text="로그인" onClick={() => navigate('/login')} />
                <Button
                  text="회원가입"
                  onClick={() => navigate('/signup')}
                  variant="secondary"
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
