import React, { useState } from 'react';
import Text from '@components/Text';
import Button from '@components/Button';
import TermsModal from '@components/TermsModal';
import { SignupFormData } from 'types/signup';
import { PiArrowRight } from 'react-icons/pi';

interface StepAgreementProps {
  onNext: () => void;
  formData: SignupFormData;
  setFormData: (data: Partial<SignupFormData>) => void;
}

const StepAgreement: React.FC<StepAgreementProps> = ({
  onNext,
  formData,
  setFormData,
}) => {
  const { agree1, agree2 } = formData;
  const allChecked = agree1 && agree2;

  const [modalContent, setModalContent] = useState<null | 'terms' | 'privacy'>(
    null
  );

  const handleAllChange = (checked: boolean) => {
    setFormData({ agree1: checked, agree2: checked });
  };

  return (
    <div className="space-y-10 py-14 max-w-2xl mx-auto">
      <div className="space-y-3">
        <Text variant="body" className="text-gray">
          회원가입
        </Text>
        <Text variant="heading" weight="bold">
          이용약관 동의
        </Text>
      </div>

      <div
        className={`flex w-full rounded-xl p-6 items-center cursor-pointer text-lg ${
          allChecked ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
        }`}
        onClick={() => handleAllChange(!allChecked)}
      >
        <input
          type="checkbox"
          checked={allChecked}
          readOnly
          className="mr-3 w-5 h-5"
        />
        <span className="font-medium">전체 약관 동의</span>
      </div>

      <div className="space-y-5 pl-1">
        <label className="flex items-center justify-between">
          <div>
            <input
              type="checkbox"
              checked={agree1}
              onChange={(e) => setFormData({ agree1: e.target.checked })}
              className="mr-3"
            />
            (필수) 이용 약관 동의
          </div>
          <button
            onClick={() => setModalContent('terms')}
            className="text-blue-600 hover:underline"
          >
            상세 보기
          </button>
        </label>

        <label className="flex items-center justify-between">
          <div>
            <input
              type="checkbox"
              checked={agree2}
              onChange={(e) => setFormData({ agree2: e.target.checked })}
              className="mr-3"
            />
            (필수) 개인정보 수집 동의
          </div>
          <button
            onClick={() => setModalContent('privacy')}
            className="text-blue-600 hover:underline"
          >
            상세 보기
          </button>
        </label>
      </div>

      <div className="flex justify-end">
        <Button
          text="다음"
          onClick={onNext}
          disabled={!allChecked}
          size="large"
          iconPosition="right"
          icon={<PiArrowRight size={20} />}
        />
      </div>

      {modalContent === 'terms' && (
        <TermsModal
          title="이용 약관"
          content={`1. 본 서비스는 제출된 코드 유사도 분석을 목적으로 제공됩니다.
2. 사용자는 타인의 정보를 도용하거나 부정 이용해서는 안 됩니다.
3. 서비스 제공자는 사전 예고 없이 서비스를 변경, 중단할 수 있습니다.
...`}
          onClose={() => setModalContent(null)}
        />
      )}

      {modalContent === 'privacy' && (
        <TermsModal
          title="개인정보 수집 및 이용"
          content={`1. 수집 항목: 이메일, 닉네임, 생년월일, 아이디, 비밀번호 등
2. 수집 목적: 사용자 식별, 유사도 분석 결과 제공
3. 보유 기간: 회원 탈퇴 시까지 보관
...`}
          onClose={() => setModalContent(null)}
        />
      )}
    </div>
  );
};

export default StepAgreement;
