import React, { useState, useEffect } from 'react';
import Text from '@components/Text';
import Button from '@components/Button';
import { SignupFormData } from 'types/signup';

interface StepBirthProps {
  onNext: () => void;
  onBack: () => void;
  formData: SignupFormData;
  setFormData: (data: Partial<SignupFormData>) => void;
}

const StepBirth: React.FC<StepBirthProps> = ({
  onNext,
  onBack,
  formData,
  setFormData,
}) => {
  const [birth, setBirth] = useState(formData.birth || '');
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const birthRegex = /^\d{4}-\d{2}-\d{2}$/;
    setIsValid(birthRegex.test(birth));
  }, [birth]);

  const handleNext = () => {
    if (!isValid) return;
    setFormData({ birth });
    onNext();
  };

  return (
    <div className="space-y-10 px-8 py-14 max-w-2xl mx-auto text-base">
      {/* 상단 안내 */}
      <div className="space-y-3">
        <Text variant="body" className="text-gray-500 text-lg">
          회원가입
        </Text>
        <Text variant="heading" weight="bold" className="text-3xl">
          생년월일을 입력해 주세요
        </Text>
      </div>

      {/* 입력창 */}
      <div className="w-full relative">
        <input
          type="date"
          value={birth}
          onChange={(e) => {
            setBirth(e.target.value);
            setTouched(true);
          }}
          className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-black text-xl py-2 pr-10"
        />
        {isValid && (
          <span className="absolute right-2 top-2 text-blue-500 text-xl">
            ✔️
          </span>
        )}
      </div>

      {/* 유효성 경고 */}
      {!isValid && touched && (
        <div className="text-red-500 text-sm">
          올바른 날짜 형식(예: 2000-01-01)으로 입력해 주세요.
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="flex justify-between w-full mt-8">
        <button onClick={onBack} className="text-sm text-gray-500 underline">
          ← 이전으로
        </button>
        <Button
          text="다음"
          onClick={handleNext}
          disabled={!isValid}
          className={`bg-blue-500 text-white px-6 py-2 rounded text-lg ${
            isValid ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'
          }`}
          iconPosition="right"
          icon={<span>→</span>}
        />
      </div>
    </div>
  );
};

export default StepBirth;
