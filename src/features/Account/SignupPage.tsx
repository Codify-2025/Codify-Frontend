import React, { useState } from 'react';
import Layout from '@components/Layout';
import StepAgreement from './StepAgreement';
import StepNickname from './StepNickname';
import StepCredentials from './StepCredentials';
import StepSuccess from './StepSuccess';
import ProgressBar from './ProgressBar';
import { SignupFormData } from 'types/signup';

const SignupPage: React.FC = () => {
  const [step, setStep] = useState(0);

  const [formData, setFormDataState] = useState<SignupFormData>({
    agree1: false,
    agree2: false,
    nickname: '',
    id: '',
    password: '',
  });

  // Partial 업데이트
  const setFormData = (data: Partial<SignupFormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => Math.max(0, prev - 1));

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-12">
        {step < 3 && <ProgressBar currentStep={step} />}

        {step === 0 && (
          <StepAgreement
            onNext={goNext}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {step === 1 && (
          <StepNickname
            onNext={goNext}
            onBack={goBack}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {step === 2 && (
          <StepCredentials
            onNext={goNext}
            onBack={goBack}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {step === 3 && <StepSuccess />}
      </div>
    </Layout>
  );
};

export default SignupPage;
