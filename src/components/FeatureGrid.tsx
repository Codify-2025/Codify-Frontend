import Text from '@components/Text';

const FEATURES = [
  {
    icon: '🔗',
    title: '유사도 네트워크',
    desc: '학생 간 유사도를 그래프로 시각화하여 의심 구간을 빠르게 좁힙니다.',
    img: '/network_graph_screenshot.png',
  },
  {
    icon: '🧠',
    title: '코드 비교 뷰어',
    desc: 'GitHub 스타일 라인 비교로 구조적 유사성을 명확히 확인합니다.',
    img: '/compare_screenshot.png',
  },
  {
    icon: '💾',
    title: '결과 저장·누적 통계',
    desc: '과제·주차별 기록을 보관하고 표절 위험도를 누적으로 관리합니다.',
    img: '/accumulate_screenshot.png',
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
      {FEATURES.map((f) => (
        <article
          key={f.title}
          className="group rounded-2xl border border-gray-200 bg-white p-4 md:p-5 lg:p-6 shadow-sm transition hover:shadow-md"
        >
          <div className="overflow-hidden rounded-xl border border-gray-100 aspect-[16/9]">
            <img
              src={f.img}
              alt={`${f.title} 스크린샷`}
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1024px) 28vw, (min-width: 768px) 33vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
            />
          </div>

          <div className="mt-4 md:mt-5 space-y-1.5 md:space-y-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl md:text-3xl shrink-0">{f.icon}</span>
              <Text
                as="h3"
                variant="h3"
                weight="semibold"
                className="!text-lg md:!text-xl truncate"
              >
                {f.title}
              </Text>
            </div>
            <Text
              variant="body"
              color="muted"
              className="block w-full max-w-none !text-sm md:!text-base leading-relaxed break-keep"
            >
              {f.desc}
            </Text>
          </div>
        </article>
      ))}
    </div>
  );
}
