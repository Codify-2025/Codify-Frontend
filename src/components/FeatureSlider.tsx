import Slider from 'react-slick';
import Text from '@components/Text';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import classNames from 'classnames';

const features = [
  {
    icon: '🔗',
    title: '유사도 네트워크',
    desc: '학생 간 코드 유사도를 네트워크 그래프로 보여줍니다.\n노드와 엣지를 통해 \n관계를 직관적으로 파악할 수 있습니다.',
    img: '/network_graph_screenshot.png',
  },
  {
    icon: '🧠',
    title: '코드 비교 뷰어',
    desc: 'GitHub 스타일의 라인 단위 비교로 \n두 코드의 구조적 유사성을 \n명확하게 확인할 수 있습니다.',
    img: '/compare_screenshot.png',
  },
  {
    icon: '💾',
    title: '결과 저장 및 관리',
    desc: '분석 결과를 저장하고, \n누적 통계를 확인하며 \n과제별 표절 위험을 효율적으로 관리하세요.',
    img: '/accumulate_screenshot.png',
  },
];

const Arrow = ({
  className,
  onClick,
  direction,
}: {
  className?: string;
  onClick?: () => void;
  direction: 'left' | 'right';
}) => (
  <div
    className={classNames(
      className,
      'z-10 absolute top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 text-xl text-gray-600 hover:bg-blue-100 cursor-pointer',
      direction === 'left' ? '-left-6' : '-right-6'
    )}
    onClick={onClick}
  >
    {direction === 'left' ? <FaChevronLeft /> : <FaChevronRight />}
  </div>
);

const FeatureSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 6000,
    nextArrow: <Arrow direction="right" />,
    prevArrow: <Arrow direction="left" />,
  };

  return (
    <section className="w-full py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Slider {...settings} className="py-10">
          {features.map((item, index) => (
            <div key={index} className="px-4">
              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">
                {/* Left - Image */}
                <div className="w-full md:w-1/2">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full rounded-2xl shadow-xl border border-gray-200"
                  />
                </div>

                {/* Right - Text */}
                <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="text-4xl">{item.icon}</span>
                    <Text
                      as="h3"
                      variant="heading"
                      weight="bold"
                      className="text-2xl md:text-3xl text-gray-800"
                    >
                      {item.title}
                    </Text>
                  </div>
                  <Text
                    as="p"
                    variant="body"
                    className="whitespace-pre-line text-gray-600 text-lg leading-relaxed"
                  >
                    {item.desc}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default FeatureSlider;
