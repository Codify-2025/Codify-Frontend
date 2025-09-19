import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import { useNavigate } from 'react-router-dom';
import { useAnalyzePolling } from '@hooks/useAnalyzePolling';

const SimilarityLoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isError, error } = useAnalyzePolling();

  // 진행률(0~100) - 시각적 효과용
  const [progress, setProgress] = useState(0);
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

  const phaseIdx = useMemo(() => {
    const idx = thresholds.findIndex(
      (t, i) => progress >= t && progress < (thresholds[i + 1] ?? 101)
    );
    return idx === -1 ? 0 : idx;
  }, [progress, thresholds]);

  // ✅ 진행률 애니메이션 (시각용). 완료는 "API 응답"에 따라 이동한다.
  useEffect(() => {
    const duration = 6000; // 6s 정도로 천천히
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = now - startRef.current;
      const ratio = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(ratio);
      const next = Math.round(eased * 100);
      setProgress(next);

      // 진행률은 100%가 되더라도, 실제 완료는 API status에 따름.
      if (ratio < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ✅ API가 done이 되는 순간 완료 페이지로 이동
  useEffect(() => {
    if (data?.status === 'done') {
      navigate('/analysis/complete', { replace: true });
    }
  }, [data?.status, navigate]);

  // 에러 처리(필요 시 토스트/다이얼로그 연동)
  if (isError) {
    return (
      <Layout>
        <div className="flex h-[70vh] flex-col items-center justify-center px-4 text-center">
          <Text variant="h3" weight="bold" className="text-red-600">
            분석 요청 중 오류가 발생했어요
          </Text>
          <Text variant="body" className="mt-2 text-gray-600">
            {error?.message ?? '잠시 후 다시 시도해 주세요.'}
          </Text>
          <button
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white"
            onClick={() => window.history.back()}
          >
            돌아가기
          </button>
        </div>
      </Layout>
    );
  }

  const statusLabel =
    data?.status === 'done'
      ? '결과 마무리 중'
      : '서버에서 코드를 파싱/분석하는 중입니다';

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
            {statusLabel}
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
