import React from 'react';
import { useNavigate } from 'react-router-dom';
import Text from '@components/Text';
import Button from '@components/Button';
import Layout from '@components/Layout';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout contentClassName="bg-gradient-to-b from-blue-100 via-white to-white">
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-20 space-y-32">
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <Text
              variant="heading"
              weight="bold"
              className="text-5xl text-black"
            >
              🚀 Codify
            </Text>
            <Text variant="body" className="text-xl text-gray-700">
              제출된 코드 간 유사도를 시각화하고
              <br />
              표절 가능성을 쉽게 파악할 수 있는 스마트한 분석 도구입니다.
            </Text>
            <div className="mt-10 flex justify-center">
              <Button
                text="유사도 분석 시작하기"
                variant="primary"
                className="text-lg px-10 py-5 text-white text-2xl rounded-lg shadow-lg"
                onClick={() => navigate('/assignment/name')}
              />
            </div>
          </section>

          {/* 기능 소개 Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: '🔗',
                title: '유사도 네트워크',
                desc: '제출자 간 유사도를 시각적으로 보여줍니다.',
              },
              {
                icon: '🧠',
                title: '코드 비교 뷰어',
                desc: '두 코드의 구조와 내용을 줄 단위로 비교합니다.',
              },
              {
                icon: '💾',
                title: '저장 및 관리',
                desc: '과제별 분석 결과를 저장하고 쉽게 관리하세요.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl shadow p-8 hover:shadow-md transition"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-xl text-gray-800 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </section>

          {/* Call to Action */}
          <section className="text-center">
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
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
