import React, { useState, useEffect } from 'react';
import Text from '@components/Text';
import Button from '@components/Button';
import { SignupFormData } from 'types/signup';
import { FiArrowRight } from 'react-icons/fi';

interface StepNicknameProps {
  onNext: () => void;
  onBack: () => void;
  formData: SignupFormData;
  setFormData: (data: Partial<SignupFormData>) => void;
}

const StepNickname: React.FC<StepNicknameProps> = ({
  onNext,
  onBack,
  formData,
  setFormData,
}) => {
  const [nickname, setNickname] = useState(formData.nickname || '');
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false); // 입력 여부 확인용

  useEffect(() => {
    const valid = /^[가-힣a-zA-Z]{2,5}$/.test(nickname);
    setIsValid(valid);
  }, [nickname]);

  const handleNext = () => {
    if (!isValid) return;
    setFormData({ nickname });
    onNext();
  };

  return (
    <div className="space-y-10 px-8 py-14 max-w-2xl mx-auto text-base">
      {/* 상단 안내 */}
      <div className="space-y-3">
        <Text variant="body" className="text-gray">
          회원가입
        </Text>
        <Text variant="heading" weight="bold">
          닉네임을 입력해 주세요
        </Text>
        <p className="text-gray-500">
          닉네임은 <strong>2~5자 이내</strong>의 <strong>한글 또는 영문</strong>
          만 사용할 수 있습니다.
        </p>
      </div>

      {/* 입력창 */}
      <div className="w-full relative">
        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setTouched(true); // 사용자가 입력한 적 있음을 표시
          }}
          placeholder="닉네임 입력"
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
        <div className="text-danger">
          닉네임은 한글 또는 영문으로 2~5자 이내로 입력해 주세요.
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="flex justify-between w-full mt-8">
        <button onClick={onBack} className="text-gray underline">
          이전으로
        </button>
        <Button
          text="다음"
          onClick={handleNext}
          disabled={!isValid}
          size="large"
          className={` ${
            isValid ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'
          }`}
          iconPosition="right"
          icon={<FiArrowRight size={20} />}
        />
      </div>
    </div>
  );
};

export default StepNickname;
