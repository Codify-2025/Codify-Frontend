import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import { useNavigate } from 'react-router-dom';

const SimilarityLoadingPage: React.FC = () => {
  const navigate = useNavigate();

  // 진행률(0~100)
  const [progress, setProgress] = useState(0);

  // rAF용 레퍼런스
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // 단계 라벨 / 경계
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

  // progress → 현재 단계 인덱스(상태 대신 파생값)
  const phaseIdx = useMemo(() => {
    const idx = thresholds.findIndex(
      (t, i) => progress >= t && progress < (thresholds[i + 1] ?? 101)
    );
    return idx === -1 ? 0 : idx;
  }, [progress, thresholds]);

  useEffect(() => {
    const duration = 3000; // 3s

    // 살짝 더 부드럽게 보이도록 easeOutCubic 적용
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = now - startRef.current;
      const ratio = Math.min(elapsed / duration, 1); // 0~1
      const eased = easeOutCubic(ratio);
      const next = Math.round(eased * 100);
      setProgress(next);

      if (ratio < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        navigate('/analysis/complete', { replace: true });
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [navigate]);

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
              className="h-full bg-blue-600 transition-[width] duration-100"
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
