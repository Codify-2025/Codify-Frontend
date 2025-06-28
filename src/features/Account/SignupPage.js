import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Layout from '@components/Layout';
import StepAgreement from './StepAgreement';
import StepNickname from './StepNickname';
import StepBirth from './StepBirth';
import StepCredentials from './StepCredentials';
import StepSuccess from './StepSuccess';
import ProgressBar from './ProgressBar';
const SignupPage = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormDataState] = useState({
        agree1: false,
        agree2: false,
        nickname: '',
        birth: '',
        id: '',
        password: '',
    });
    // Partial 업데이트
    const setFormData = (data) => {
        setFormDataState((prev) => ({ ...prev, ...data }));
    };
    const goNext = () => setStep((prev) => prev + 1);
    const goBack = () => setStep((prev) => Math.max(0, prev - 1));
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-xl mx-auto px-4 py-12", children: [step < 4 && _jsx(ProgressBar, { currentStep: step }), step === 0 && (_jsx(StepAgreement, { onNext: goNext, formData: formData, setFormData: setFormData })), step === 1 && (_jsx(StepNickname, { onNext: goNext, onBack: goBack, formData: formData, setFormData: setFormData })), step === 2 && (_jsx(StepBirth, { onNext: goNext, onBack: goBack, formData: formData, setFormData: setFormData })), step === 3 && (_jsx(StepCredentials, { onNext: goNext, onBack: goBack, formData: formData, setFormData: setFormData })), step === 4 && _jsx(StepSuccess, {})] }) }));
};
export default SignupPage;
