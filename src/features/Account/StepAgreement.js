import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Text from '@components/Text';
import Button from '@components/Button';
import TermsModal from '@components/TermsModal';
const StepAgreement = ({ onNext, formData, setFormData, }) => {
    const { agree1, agree2 } = formData;
    const allChecked = agree1 && agree2;
    const [modalContent, setModalContent] = useState(null);
    const handleAllChange = (checked) => {
        setFormData({ agree1: checked, agree2: checked });
    };
    return (_jsxs("div", { className: "space-y-10 px-8 py-14 max-w-2xl mx-auto text-base", children: [_jsx(Text, { variant: "heading", weight: "bold", className: "text-3xl", children: "\uC774\uC6A9\uC57D\uAD00 \uB3D9\uC758" }), _jsxs("div", { className: `flex items-center p-5 rounded-lg cursor-pointer text-lg ${allChecked ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`, onClick: () => handleAllChange(!allChecked), children: [_jsx("input", { type: "checkbox", checked: allChecked, readOnly: true, className: "mr-3 w-5 h-5" }), _jsx("span", { className: "font-medium", children: "\uC804\uCCB4 \uC57D\uAD00 \uB3D9\uC758" })] }), _jsxs("div", { className: "space-y-5 pl-1 text-lg", children: [_jsxs("label", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("input", { type: "checkbox", checked: agree1, onChange: (e) => setFormData({ agree1: e.target.checked }), className: "mr-3" }), "(\uD544\uC218) \uC774\uC6A9 \uC57D\uAD00 \uB3D9\uC758"] }), _jsx("button", { onClick: () => setModalContent('terms'), className: "text-blue-600 hover:underline", children: "\uC0C1\uC138 \uBCF4\uAE30" })] }), _jsxs("label", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("input", { type: "checkbox", checked: agree2, onChange: (e) => setFormData({ agree2: e.target.checked }), className: "mr-3" }), "(\uD544\uC218) \uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1 \uB3D9\uC758"] }), _jsx("button", { onClick: () => setModalContent('privacy'), className: "text-blue-600 hover:underline", children: "\uC0C1\uC138 \uBCF4\uAE30" })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { text: "\uB2E4\uC74C", onClick: onNext, disabled: !allChecked, className: "bg-blue-500 text-white px-8 py-3 text-lg rounded", iconPosition: "right", icon: _jsx("span", { children: "\u2192" }) }) }), modalContent === 'terms' && (_jsx(TermsModal, { title: "\uC774\uC6A9 \uC57D\uAD00", content: `1. 본 서비스는 제출된 코드 유사도 분석을 목적으로 제공됩니다.
2. 사용자는 타인의 정보를 도용하거나 부정 이용해서는 안 됩니다.
3. 서비스 제공자는 사전 예고 없이 서비스를 변경, 중단할 수 있습니다.
...`, onClose: () => setModalContent(null) })), modalContent === 'privacy' && (_jsx(TermsModal, { title: "\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1 \uBC0F \uC774\uC6A9", content: `1. 수집 항목: 이메일, 닉네임, 생년월일, 아이디, 비밀번호 등
2. 수집 목적: 사용자 식별, 유사도 분석 결과 제공
3. 보유 기간: 회원 탈퇴 시까지 보관
...`, onClose: () => setModalContent(null) }))] }));
};
export default StepAgreement;
