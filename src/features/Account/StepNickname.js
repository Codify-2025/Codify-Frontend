import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Text from '@components/Text';
import Button from '@components/Button';
const StepNickname = ({ onNext, onBack, formData, setFormData, }) => {
    const [nickname, setNickname] = useState(formData.nickname || '');
    const [isValid, setIsValid] = useState(false);
    const [touched, setTouched] = useState(false); // 입력 여부 확인용
    useEffect(() => {
        const valid = /^[가-힣a-zA-Z]{2,5}$/.test(nickname);
        setIsValid(valid);
    }, [nickname]);
    const handleNext = () => {
        if (!isValid)
            return;
        setFormData({ nickname });
        onNext();
    };
    return (_jsxs("div", { className: "space-y-10 px-8 py-14 max-w-2xl mx-auto text-base", children: [_jsxs("div", { className: "space-y-3", children: [_jsx(Text, { variant: "body", className: "text-gray-500 text-lg", children: "\uD68C\uC6D0\uAC00\uC785" }), _jsx(Text, { variant: "heading", weight: "bold", className: "text-3xl", children: "\uB2C9\uB124\uC784\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694" }), _jsxs("p", { className: "text-gray-500 text-sm", children: ["\uB2C9\uB124\uC784\uC740 ", _jsx("strong", { children: "2~5\uC790 \uC774\uB0B4" }), "\uC758 ", _jsx("strong", { children: "\uD55C\uAE00 \uB610\uB294 \uC601\uBB38" }), "\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."] })] }), _jsxs("div", { className: "w-full relative", children: [_jsx("input", { type: "text", value: nickname, onChange: (e) => {
                            setNickname(e.target.value);
                            setTouched(true); // 사용자가 입력한 적 있음을 표시
                        }, placeholder: "\uB2C9\uB124\uC784 \uC785\uB825", className: "w-full border-b-2 border-gray-300 focus:outline-none focus:border-black text-xl py-2 pr-10" }), isValid && (_jsx("span", { className: "absolute right-2 top-2 text-blue-500 text-xl", children: "\u2714\uFE0F" }))] }), !isValid && touched && (_jsx("div", { className: "text-red-500 text-sm", children: "\uB2C9\uB124\uC784\uC740 \uD55C\uAE00 \uB610\uB294 \uC601\uBB38\uC73C\uB85C 2~5\uC790 \uC774\uB0B4\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694." })), _jsxs("div", { className: "flex justify-between w-full mt-8", children: [_jsx("button", { onClick: onBack, className: "text-sm text-gray-500 underline", children: "\u2190 \uC774\uC804\uC73C\uB85C" }), _jsx(Button, { text: "\uB2E4\uC74C", onClick: handleNext, disabled: !isValid, className: `bg-blue-500 text-white px-6 py-2 rounded text-lg ${isValid ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'}`, iconPosition: "right", icon: _jsx("span", { children: "\u2192" }) })] })] }));
};
export default StepNickname;
