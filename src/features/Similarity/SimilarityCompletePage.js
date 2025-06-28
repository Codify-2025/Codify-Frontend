import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
const SimilarityCompletePage = () => {
    const navigate = useNavigate();
    return (_jsx(Layout, { children: _jsxs("div", { className: "flex flex-col items-center justify-center h-[70vh] space-y-6", children: [_jsx("div", { className: "w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center", children: _jsx(FiCheck, { className: "text-white text-4xl" }) }), _jsx(Text, { variant: "heading", weight: "bold", className: "text-black text-4xl", children: "\uC720\uC0AC\uB3C4 \uBD84\uC11D \uC644\uB8CC" }), _jsx(Button, { text: "\uACB0\uACFC \uBCF4\uB7EC \uAC00\uAE30", variant: "primary", onClick: () => navigate('/result') })] }) }));
};
export default SimilarityCompletePage;
