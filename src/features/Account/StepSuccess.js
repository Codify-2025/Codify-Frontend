import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Text from '@components/Text';
import Button from '@components/Button';
import { FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
const StepSuccess = () => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "flex flex-col items-center justify-center h-[70vh] space-y-6", children: [_jsx("div", { className: "w-28 h-28 bg-green-500 rounded-full flex items-center justify-center", children: _jsx(FiCheck, { className: "text-white text-4xl" }) }), _jsx(Text, { variant: "heading", weight: "bold", className: "text-black text-3xl text-center", children: "\uD68C\uC6D0\uAC00\uC785\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4!" }), _jsx(Text, { variant: "body", className: "text-gray-600 text-center", children: "\uC9C0\uAE08 \uBC14\uB85C Codify\uC758 \uAE30\uB2A5\uC744 \uC0AC\uC6A9\uD574\uBCF4\uC138\uC694." }), _jsxs("div", { className: "flex gap-4 mt-4", children: [_jsx(Button, { text: "\uD648\uC73C\uB85C \uAC00\uAE30", variant: "secondary", onClick: () => navigate('/') }), _jsx(Button, { text: "\uB85C\uADF8\uC778\uD558\uB7EC \uAC00\uAE30", variant: "primary", onClick: () => navigate('/login') })] })] }));
};
export default StepSuccess;
