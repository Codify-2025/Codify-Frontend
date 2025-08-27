import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import { useNavigate } from 'react-router-dom';

const SimilarityLoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const phases = useMemo(
    () => [
      '파일 파싱',
      '토큰화/AST 분석',
      '유사도 계산',
      '클러스터링',
      '시각화 준비',
    ],
    []
  );
  const thresholds = useMemo(() => [0, 20, 45, 70, 85], []);

  useEffect(() => {
    // 부드러운 가짜 진행률: 0→92% 사이에서 가변 증가
    intervalRef.current = window.setInterval(() => {
      setProgress((p) => {
        const delta = Math.floor(Math.random() * 4) + 1; // 1~4%
        const next = Math.min(p + delta, 92);
        const idx = thresholds.findIndex(
          (t, i) => next >= t && next < (thresholds[i + 1] ?? 101)
        );
        if (idx !== -1 && idx !== phaseIdx) setPhaseIdx(idx);
        return next;
      });
    }, 120);

    // 완료 페이지로 전환
    timeoutRef.current = window.setTimeout(() => {
      setPhaseIdx(phases.length - 1);
      setProgress(100);
      navigate('/analysis/complete');
    }, 3000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [navigate, phases.length, thresholds, phaseIdx]);

  return (
    <Layout>
      <div className="flex h-[80vh] flex-col items-center justify-center px-4 text-center">
        {/* 로딩 스피너 */}
        <div className="relative h-28 w-28 drop-shadow-lg">
          <div className="absolute inset-0 rounded-full border-4 border-black/10" />
          <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {progress}%
            </span>
          </div>
        </div>

        {/* 메인 텍스트 */}
        <div className="mt-8 space-y-2">
          <Text variant="h2" weight="bold" className="text-gray-900">
            유사도 분석 중입니다…
          </Text>
          <Text variant="body" className="text-gray-600">
            제출한 코드들을 분석하여 결과를 준비하고 있어요.
          </Text>
        </div>

        {/* 진행 바 + 단계 */}
        <div className="mt-8 w-full max-w-xl">
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-left">
            <Text variant="caption" color="muted">
              현재 단계: {phases[phaseIdx]}
            </Text>
            <Text variant="caption" color="muted">
              진행률 {progress}%
            </Text>
          </div>
        </div>

        {/* 접근성 라이브 영역 */}
        <div aria-live="polite" className="sr-only">
          분석 진행률 {progress}퍼센트, {phases[phaseIdx]} 단계
        </div>
      </div>
    </Layout>
  );
};

export default SimilarityLoadingPage;
