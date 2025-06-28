import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Text from '@components/Text';
import Button from '@components/Button';
import { FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
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
const StepCredentials = ({ onNext, onBack, formData, setFormData, }) => {
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
    const pwValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
    const pwMatch = password === confirmPassword && confirmPassword !== '';
    useEffect(() => {
        setIsValid(isEmailValid && pwValid && pwMatch && isDuplicateChecked);
    }, [email, pwValid, pwMatch, isDuplicateChecked]);
    const handleNext = () => {
        if (!isValid)
            return;
        setFormData({ id: email, password });
        onNext();
    };
    const handleDuplicateCheck = () => {
        if (!isEmailValid)
            return alert('이메일 형식을 확인해주세요.');
        setIsDuplicateChecked(true);
        alert('사용 가능한 이메일입니다.');
    };
    return (_jsxs("div", { className: "flex flex-col space-y-10", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Text, { variant: "body", className: "text-gray-500 text-lg", children: "\uD68C\uC6D0\uAC00\uC785" }), _jsx(Text, { variant: "heading", weight: "bold", className: "text-2xl", children: "\uC544\uC774\uB514\uC640 \uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694" })] }), _jsxs("div", { className: "flex gap-2 items-center w-full", children: [_jsx("input", { type: "text", value: emailId, onChange: (e) => {
                            setEmailId(e.target.value);
                            setIsDuplicateChecked(false);
                        }, placeholder: "\uC774\uBA54\uC77C \uC544\uC774\uB514", className: "flex-1 border-b-2 border-gray-300 focus:border-black text-lg py-2" }), _jsx("span", { children: "@" }), domain === '직접 입력' ? (_jsx("input", { type: "text", value: customDomain, onChange: (e) => {
                            setCustomDomain(e.target.value);
                            setIsDuplicateChecked(false);
                        }, placeholder: "\uB3C4\uBA54\uC778 \uC785\uB825", className: "flex-1 border-b-2 border-gray-300 focus:border-black text-lg py-2" })) : (_jsx("select", { value: domain, onChange: (e) => {
                            setDomain(e.target.value);
                            setCustomDomain('');
                            setIsDuplicateChecked(false);
                        }, className: "flex-1 border-b-2 border-gray-300 focus:border-black text-lg py-2", children: emailDomains.map((d) => (_jsx("option", { value: d, children: d }, d))) })), _jsx("button", { onClick: handleDuplicateCheck, className: "ml-2 px-4 py-1 border border-blue-500 text-blue-500 rounded text-sm hover:bg-blue-50", children: "\uC911\uBCF5\uD655\uC778" })] }), _jsxs("div", { className: "relative w-full", children: [_jsx("input", { type: showPassword ? 'text' : 'password', placeholder: "\uBE44\uBC00\uBC88\uD638 (\uC601\uBB38+\uC22B\uC790+\uD2B9\uC218\uBB38\uC790 \uD3EC\uD568, 8\uC790 \uC774\uC0C1)", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full border-b-2 border-gray-300 focus:border-black text-lg py-2 pr-10" }), _jsx("span", { className: "absolute right-8 top-2 cursor-pointer text-gray-500", onClick: () => setShowPassword(!showPassword), children: showPassword ? _jsx(FiEyeOff, {}) : _jsx(FiEye, {}) }), pwValid && (_jsx(FiCheck, { className: "absolute right-2 top-2 text-blue-500" })), !pwValid && password.length > 0 && (_jsx("span", { className: "text-red-500 text-sm mt-1 block", children: "\uBE44\uBC00\uBC88\uD638 \uC870\uAC74\uC744 \uCDA9\uC871\uD574\uC57C \uD569\uB2C8\uB2E4." }))] }), _jsxs("div", { className: "relative w-full", children: [_jsx("input", { type: showConfirm ? 'text' : 'password', placeholder: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: `w-full border-b-2 text-lg py-2 pr-10 ${confirmPassword && !pwMatch
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-gray-300 focus:border-black'}` }), _jsx("span", { className: "absolute right-8 top-2 cursor-pointer text-gray-500", onClick: () => setShowConfirm(!showConfirm), children: showConfirm ? _jsx(FiEyeOff, {}) : _jsx(FiEye, {}) }), confirmPassword && pwMatch && (_jsx(FiCheck, { className: "absolute right-2 top-2 text-blue-500" })), confirmPassword && !pwMatch && (_jsx("span", { className: "text-red-500 text-sm mt-1 block", children: "\uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4." }))] }), _jsxs("div", { className: "flex justify-between w-full pt-4", children: [_jsx("button", { onClick: onBack, className: "text-sm text-gray-500 underline", children: "\u2190 \uC774\uC804\uC73C\uB85C" }), _jsx(Button, { text: "\uB2E4\uC74C \u2192", onClick: handleNext, disabled: !isValid, className: `bg-blue-500 text-white px-6 py-2 rounded ${isValid ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'}` })] })] }));
};
export default StepCredentials;
