import React, { useState, useEffect } from 'react';
import Text from '@components/Text';
import Button from '@components/Button';
import { SignupFormData } from 'types/signup';
import { FiEye, FiEyeOff, FiCheck, FiArrowRight } from 'react-icons/fi';

interface StepCredentialsProps {
  onNext: () => void;
  onBack: () => void;
  formData: SignupFormData;
  setFormData: (data: Partial<SignupFormData>) => void;
}

const emailDomains = [
  'gmail.com',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'hotmail.com',
  'icloud.com',
  'kakao.com',
  'outlook.com',
  'nate.com',
  '직접 입력',
];

const StepCredentials: React.FC<StepCredentialsProps> = ({
  onNext,
  onBack,
  formData,
  setFormData,
}) => {
  const [emailId, setEmailId] = useState('');
  const [domain, setDomain] = useState(emailDomains[0]);
  const [customDomain, setCustomDomain] = useState('');
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);

  const [password, setPassword] = useState(formData.password || '');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const email = `${emailId}@${domain === '직접 입력' ? customDomain : domain}`;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const pwValid =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
      password
    );
  const pwMatch = password === confirmPassword && confirmPassword !== '';

  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    setIsValid(isEmailValid && pwValid && pwMatch && isDuplicateChecked);
  }, [isEmailValid, pwValid, pwMatch, isDuplicateChecked]);

  const handleNext = () => {
    if (!isValid) return;
    setFormData({ id: email, password });
    onNext();
  };

  const handleDuplicateCheck = () => {
    if (!isEmailValid) {
      alert('이메일 형식을 확인해주세요.');
      return;
    }
    setIsDuplicateChecked(true);
    alert('사용 가능한 이메일입니다.');
  };

  return (
    <div className="mt-14 flex flex-col space-y-10">
      <div className="space-y-2">
        <Text variant="body" color="muted">
          회원가입
        </Text>
        <Text variant="h2" weight="bold">
          아이디와 비밀번호를 입력해 주세요
        </Text>
      </div>

      {/* 이메일 */}
      <div className="flex w-full items-center gap-2">
        <input
          type="text"
          value={emailId}
          onChange={(e) => {
            setEmailId(e.target.value);
            setIsDuplicateChecked(false);
          }}
          placeholder="이메일 아이디"
          className="flex-1 border-b-2 border-gray-300 py-2 text-lg outline-none focus:border-gray-900"
        />
        <span>@</span>
        {domain === '직접 입력' ? (
          <input
            type="text"
            value={customDomain}
            onChange={(e) => {
              setCustomDomain(e.target.value);
              setIsDuplicateChecked(false);
            }}
            placeholder="도메인 입력"
            className="flex-1 border-b-2 border-gray-300 py-2 text-lg outline-none focus:border-gray-900"
          />
        ) : (
          <select
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setCustomDomain('');
              setIsDuplicateChecked(false);
            }}
            className="flex-1 border-b-2 border-gray-300 bg-transparent py-2 text-lg outline-none focus:border-gray-900"
          >
            {emailDomains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}
        <Button
          text="중복확인"
          variant="secondary"
          size="md"
          onClick={handleDuplicateCheck}
        />
      </div>
      {!isEmailValid && (emailId || customDomain) && (
        <p className="text-sm text-red-600">
          올바른 이메일 주소를 입력해 주세요.
        </p>
      )}
      {isDuplicateChecked && isEmailValid && (
        <p className="text-sm text-green-600">사용 가능한 이메일입니다.</p>
      )}

      {/* 비밀번호 */}
      <div className="relative w-full">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호 (영문+숫자+특수문자 포함, 8자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={[
            'w-full border-b-2 bg-transparent py-2 pr-12 text-lg outline-none',
            password && !pwValid
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-300 focus:border-gray-900',
          ].join(' ')}
        />
        <button
          type="button"
          aria-label="비밀번호 보기 전환"
          className="absolute right-8 top-2 text-gray-500"
          onClick={() => setShowPassword((v) => !v)}
        >
          {showPassword ? <FiEye /> : <FiEyeOff />}
        </button>
        {pwValid && (
          <FiCheck className="absolute right-2 top-2 text-blue-600" />
        )}
        {!pwValid && password.length > 0 && (
          <p className="mt-1 text-sm text-red-600">
            영문, 숫자, 특수문자를 포함하여 8자 이상 입력하세요.
          </p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="relative w-full">
        <input
          type={showConfirm ? 'text' : 'password'}
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={[
            'w-full bg-transparent py-2 pr-12 text-lg outline-none border-b-2',
            confirmPassword && !pwMatch
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-300 focus:border-gray-900',
          ].join(' ')}
        />
        <button
          type="button"
          aria-label="비밀번호 확인 보기 전환"
          className="absolute right-8 top-2 text-gray-500"
          onClick={() => setShowConfirm((v) => !v)}
        >
          {showConfirm ? <FiEye /> : <FiEyeOff />}
        </button>
        {confirmPassword && pwMatch && (
          <FiCheck className="absolute right-2 top-2 text-blue-600" />
        )}
        {confirmPassword && !pwMatch && (
          <p className="mt-1 text-sm text-red-600">
            비밀번호가 일치하지 않습니다.
          </p>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex w-full justify-between pt-2">
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

export default StepCredentials;
