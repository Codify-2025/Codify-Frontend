import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Text from '@components/Text';
import Button from '@components/Button';
const StepBirth = ({ onNext, onBack, formData, setFormData, }) => {
    const [birth, setBirth] = useState(formData.birth || '');
    const [isValid, setIsValid] = useState(false);
    const [touched, setTouched] = useState(false);
    useEffect(() => {
        const birthRegex = /^\d{4}-\d{2}-\d{2}$/;
        setIsValid(birthRegex.test(birth));
    }, [birth]);
    const handleNext = () => {
        if (!isValid)
            return;
        setFormData({ birth });
        onNext();
    };
    return (_jsxs("div", { className: "space-y-10 px-8 py-14 max-w-2xl mx-auto text-base", children: [_jsxs("div", { className: "space-y-3", children: [_jsx(Text, { variant: "body", className: "text-gray-500 text-lg", children: "\uD68C\uC6D0\uAC00\uC785" }), _jsx(Text, { variant: "heading", weight: "bold", className: "text-3xl", children: "\uC0DD\uB144\uC6D4\uC77C\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694" })] }), _jsxs("div", { className: "w-full relative", children: [_jsx("input", { type: "date", value: birth, onChange: (e) => {
                            setBirth(e.target.value);
                            setTouched(true);
                        }, className: "w-full border-b-2 border-gray-300 focus:outline-none focus:border-black text-xl py-2 pr-10" }), isValid && (_jsx("span", { className: "absolute right-2 top-2 text-blue-500 text-xl", children: "\u2714\uFE0F" }))] }), !isValid && touched && (_jsx("div", { className: "text-red-500 text-sm", children: "\uC62C\uBC14\uB978 \uB0A0\uC9DC \uD615\uC2DD(\uC608: 2000-01-01)\uC73C\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694." })), _jsxs("div", { className: "flex justify-between w-full mt-8", children: [_jsx("button", { onClick: onBack, className: "text-sm text-gray-500 underline", children: "\u2190 \uC774\uC804\uC73C\uB85C" }), _jsx(Button, { text: "\uB2E4\uC74C", onClick: handleNext, disabled: !isValid, className: `bg-blue-500 text-white px-6 py-2 rounded text-lg ${isValid ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'}`, iconPosition: "right", icon: _jsx("span", { children: "\u2192" }) })] })] }));
};
export default StepBirth;
