import React from 'react';

interface ProgressBarProps {
  currentStep: number;
}

const steps = ['약관 동의', '닉네임', '계정 정보'];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const clamped = Math.max(0, Math.min(currentStep, steps.length - 1));
  const pct = steps.length > 0 ? ((clamped + 1) / steps.length) * 100 : 0;

  return (
    <div className="mb-8">
      <div
        className="mb-3 h-2 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-label="회원가입 진행률"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        {steps.map((label, index) => (
          <div key={label} className="flex-1 text-center">
            <span
              className={
                index === currentStep ? 'font-semibold text-gray-900' : ''
              }
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
