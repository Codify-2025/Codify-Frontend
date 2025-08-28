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
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setIsValid(/^[가-힣a-zA-Z]{2,5}$/.test(nickname));
  }, [nickname]);

  const handleNext = () => {
    if (!isValid) return;
    setFormData({ nickname });
    onNext();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-10 px-8 py-14 text-base">
      <div className="space-y-2">
        <Text variant="body" color="muted">
          회원가입
        </Text>
        <Text variant="h2" weight="bold">
          닉네임을 입력해 주세요
        </Text>
        <Text variant="caption" color="muted">
          닉네임은 <strong>2~5자</strong>의 <strong>한글/영문</strong>만
          가능합니다.
        </Text>
      </div>

      <div className="relative w-full">
        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setTouched(true);
          }}
          placeholder="닉네임 입력"
          aria-invalid={touched && !isValid}
          className={[
            'w-full border-b-2 bg-transparent py-2 pr-10 text-xl outline-none transition-colors',
            touched && !isValid
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-300 focus:border-gray-900',
          ].join(' ')}
        />
        {isValid && (
          <span className="absolute right-2 top-2 text-blue-600">✔️</span>
        )}
      </div>

      {!isValid && touched && (
        <p className="text-sm text-red-600">
          닉네임은 한글/영문 2~5자로 입력하세요.
        </p>
      )}

      <div className="mt-6 flex w-full justify-between">
        <Button text="이전으로" variant="ghost" size="md" onClick={onBack} />
        <Button
          text="다음"
          size="lg"
          onClick={handleNext}
          disabled={!isValid}
          icon={<FiArrowRight size={20} />}
          iconPosition="right"
          className={!isValid ? 'opacity-60' : ''}
        />
      </div>
    </div>
  );
};

export default StepNickname;
