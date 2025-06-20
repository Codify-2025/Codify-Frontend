import React, { useState, useEffect } from 'react';
import Text from '@components/Text';
import Button from '@components/Button';
import { SignupFormData } from '@types/signup';
import { FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';

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
  const [isValid, setIsValid] = useState(false);

  const email = `${emailId}@${domain === '직접 입력' ? customDomain : domain}`;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const pwValid =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
      password
    );
  const pwMatch = password === confirmPassword && confirmPassword !== '';

  useEffect(() => {
    setIsValid(isEmailValid && pwValid && pwMatch && isDuplicateChecked);
  }, [email, pwValid, pwMatch, isDuplicateChecked]);

  const handleNext = () => {
    if (!isValid) return;
    setFormData({ id: email, password });
    onNext();
  };

  const handleDuplicateCheck = () => {
    if (!isEmailValid) return alert('이메일 형식을 확인해주세요.');
    setIsDuplicateChecked(true);
    alert('사용 가능한 이메일입니다.');
  };

  return (
    <div className="flex flex-col space-y-10">
      <div className="space-y-2">
        <Text variant="body" className="text-gray-500 text-lg">
          회원가입
        </Text>
        <Text variant="heading" weight="bold" className="text-2xl">
          아이디와 비밀번호를 입력해주세요
        </Text>
      </div>

      {/* 이메일 입력 */}
      <div className="flex gap-2 items-center w-full">
        <input
          type="text"
          value={emailId}
          onChange={(e) => {
            setEmailId(e.target.value);
            setIsDuplicateChecked(false);
          }}
          placeholder="이메일 아이디"
          className="flex-1 border-b-2 border-gray-300 focus:border-black text-lg py-2"
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
            className="flex-1 border-b-2 border-gray-300 focus:border-black text-lg py-2"
          />
        ) : (
          <select
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setCustomDomain('');
              setIsDuplicateChecked(false);
            }}
            className="flex-1 border-b-2 border-gray-300 focus:border-black text-lg py-2"
          >
            {emailDomains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={handleDuplicateCheck}
          className="ml-2 px-4 py-1 border border-blue-500 text-blue-500 rounded text-sm hover:bg-blue-50"
        >
          중복확인
        </button>
      </div>

      {/* 비밀번호 입력 */}
      <div className="relative w-full">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호 (영문+숫자+특수문자 포함, 8자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-b-2 border-gray-300 focus:border-black text-lg py-2 pr-10"
        />
        <span
          className="absolute right-8 top-2 cursor-pointer text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </span>
        {pwValid && (
          <FiCheck className="absolute right-2 top-2 text-blue-500" />
        )}
        {!pwValid && password.length > 0 && (
          <span className="text-red-500 text-sm mt-1 block">
            비밀번호 조건을 충족해야 합니다.
          </span>
        )}
      </div>

      {/* 비밀번호 확인 입력 */}
      <div className="relative w-full">
        <input
          type={showConfirm ? 'text' : 'password'}
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full border-b-2 text-lg py-2 pr-10 ${
            confirmPassword && !pwMatch
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-black'
          }`}
        />
        <span
          className="absolute right-8 top-2 cursor-pointer text-gray-500"
          onClick={() => setShowConfirm(!showConfirm)}
        >
          {showConfirm ? <FiEyeOff /> : <FiEye />}
        </span>
        {confirmPassword && pwMatch && (
          <FiCheck className="absolute right-2 top-2 text-blue-500" />
        )}
        {confirmPassword && !pwMatch && (
          <span className="text-red-500 text-sm mt-1 block">
            비밀번호가 일치하지 않습니다.
          </span>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex justify-between w-full pt-4">
        <button onClick={onBack} className="text-sm text-gray-500 underline">
          ← 이전으로
        </button>
        <Button
          text="다음 →"
          onClick={handleNext}
          disabled={!isValid}
          className={`bg-blue-500 text-white px-6 py-2 rounded ${
            isValid ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'
          }`}
        />
      </div>
    </div>
  );
};

export default StepCredentials;
