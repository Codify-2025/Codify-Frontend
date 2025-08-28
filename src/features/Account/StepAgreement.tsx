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
    <div className="mx-auto max-w-2xl space-y-10 py-14">
      {/* 헤더 */}
      <div className="space-y-2">
        <Text variant="body" color="muted">
          회원가입
        </Text>
        <Text variant="h2" weight="bold">
          이용약관 동의
        </Text>
      </div>

      {/* 전체 동의 토글 */}
      <label
        className={[
          'flex w-full cursor-pointer items-center rounded-2xl p-5 transition-colors ring-1',
          allChecked
            ? 'bg-blue-600 text-white ring-blue-600'
            : 'bg-gray-50 text-gray-800 ring-gray-200 hover:bg-gray-100',
        ].join(' ')}
      >
        <input
          type="checkbox"
          checked={allChecked}
          onChange={(e) => handleAllChange(e.target.checked)}
          className="mr-3 h-5 w-5 accent-blue-600"
        />
        <span className="text-lg font-semibold">전체 약관 동의</span>
      </label>

      {/* 개별 항목 */}
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={agree1}
              onChange={(e) => setFormData({ agree1: e.target.checked })}
              className="mr-3 h-4 w-4 accent-blue-600"
            />
            <span>(필수) 이용 약관 동의</span>
          </label>
          <button
            type="button"
            onClick={() => setModalContent('terms')}
            className="text-sm text-blue-600 underline underline-offset-4 hover:text-blue-700"
          >
            상세 보기
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={agree2}
              onChange={(e) => setFormData({ agree2: e.target.checked })}
              className="mr-3 h-4 w-4 accent-blue-600"
            />
            <span>(필수) 개인정보 수집 동의</span>
          </label>
          <button
            type="button"
            onClick={() => setModalContent('privacy')}
            className="text-sm text-blue-600 underline underline-offset-4 hover:text-blue-700"
          >
            상세 보기
          </button>
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="flex justify-end">
        <Button
          text="다음"
          onClick={onNext}
          size="lg"
          disabled={!allChecked}
          iconPosition="right"
          icon={<PiArrowRight size={20} />}
        />
      </div>

      {/* 모달 */}
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
          content={`1. 수집 항목: 이메일, 닉네임, 아이디, 비밀번호 등
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
