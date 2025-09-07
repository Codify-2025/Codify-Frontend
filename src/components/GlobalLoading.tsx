import { useMemo } from 'react';
import { useIsFetching, useIsMutating } from 'react-query';

export default function GlobalLoading() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();

  // flicker 방지를 위해 200ms 디바운스
  const active = useMemo(() => fetching + mutating > 0, [fetching, mutating]);

  return active ? (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999]">
      {/* 상단 프로그레스 바 스타일 */}
      <div className="h-1 w-full animate-pulse bg-blue-500">
        <div className="h-1 w-1/3 animate-[loading_1.2s_ease_infinite] bg-blue-400"></div>
      </div>

      {/* 키프레임 (전역 CSS에 추가) */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  ) : null;
}
