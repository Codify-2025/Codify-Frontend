import React from 'react';

interface ProgressBarProps {
  currentStep: number; // 0~3까지만 표시 (4는 성공 화면이라 제외)
}

const steps = ['약관 동의', '닉네임', '생년월일', '계정 정보'];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="mb-8">
      {/* 막대 전체 */}
      <div className="w-full h-2 bg-lightGray rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      {/* 단계별 텍스트 */}
      <div className="flex justify-between text-gray-600">
        {steps.map((label, index) => (
          <div key={index} className="flex-1 text-center">
            <span
              className={index === currentStep ? 'font-bold text-black' : ''}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
