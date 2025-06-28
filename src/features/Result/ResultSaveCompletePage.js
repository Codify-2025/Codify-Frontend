import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
const ResultSaveCompletePage = () => {
    const navigate = useNavigate();
    return (_jsx(Layout, { children: _jsxs("div", { className: "flex flex-col items-center justify-center h-[70vh] space-y-6", children: [_jsx("div", { className: "w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center", children: _jsx(FiCheck, { className: "text-white text-4xl" }) }), _jsx(Text, { variant: "heading", weight: "bold", className: "text-black text-4xl", children: "\uACB0\uACFC \uC800\uC7A5 \uC644\uB8CC" }), _jsxs("div", { className: "flex gap-4 mt-4", children: [_jsx(Button, { text: "\uAC80\uC0AC \uC885\uB8CC\uD558\uAE30", variant: "secondary", onClick: () => navigate('/') }), _jsx(Button, { text: "\uAC80\uC0AC \uACC4\uC18D\uD558\uAE30", variant: "primary", onClick: () => navigate('/result') })] })] }) }));
};
export default ResultSaveCompletePage;
