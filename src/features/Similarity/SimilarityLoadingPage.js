import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import { useNavigate } from 'react-router-dom';
const SimilarityLoadingPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/analysis/complete');
        }, 3000); // 3초 후 이동
        return () => clearTimeout(timer);
    }, [navigate]);
    return (_jsx(Layout, { children: _jsxs("div", { className: "flex flex-col items-center justify-center h-[70vh] space-y-6", children: [_jsxs("div", { className: "relative w-24 h-24", children: [_jsx("div", { className: "absolute inset-0 rounded-full border-4 border-black/10" }), _jsx("div", { className: "absolute inset-0 rounded-full border-t-4 border-green-400 animate-spin shadow-green-300" })] }), _jsx(Text, { variant: "heading", weight: "bold", className: "text-black text-4xl", children: "\uC720\uC0AC\uB3C4 \uBD84\uC11D \uC9C4\uD589 \uC911" })] }) }));
};
export default SimilarityLoadingPage;
