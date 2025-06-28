import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useDecisionStore } from '@stores/useDecisionStore';
const PlagiarismDecisionPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { saveDecision } = useDecisionStore();
    if (!state?.fileA || !state?.fileB) {
        return (_jsx(Layout, { children: _jsxs("div", { className: "px-8 py-10", children: [_jsx(Text, { variant: "heading", weight: "bold", className: "text-xl mb-4", children: "\uD30C\uC77C \uC815\uBCF4\uAC00 \uC874\uC7AC\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4." }), _jsx(Button, { text: "\uACB0\uACFC \uD398\uC774\uC9C0\uB85C \uC774\uB3D9", onClick: () => navigate('/result') })] }) }));
    }
    const { fileA, fileB, similarity } = state;
    const handleDecision = (isPlagiarism) => {
        console.log('판단 결과:', isPlagiarism ? '표절' : '표절 아님');
        saveDecision({
            fileAId: fileA.id,
            fileBId: fileB.id,
            isPlagiarism,
        });
        navigate('/result/save'); // 판단 후 결과 저장 완료 페이지로 이동
    };
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-3xl mx-auto px-10 py-20 space-y-16", children: [_jsxs(Text, { variant: "heading", weight: "bold", className: "text-4xl leading-relaxed", children: [_jsx("span", { className: "text-blue-500", children: fileA.label }), "\uACFC", ' ', _jsx("span", { className: "text-blue-500", children: fileB.label }), "\uB97C", _jsx("br", {}), _jsx("span", { className: "text-red-500", children: "\uD45C\uC808" }), "\uB85C \uD310\uB2E8\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?"] }), _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx(Text, { variant: "caption", color: "gray", className: "text-lg", children: "\uC720\uC0AC\uB3C4" }), _jsxs(Text, { variant: "heading", weight: "bold", className: "text-red-500 text-5xl", children: [(similarity * 100).toFixed(0), "%"] })] }), _jsxs("div", { children: [_jsx(Text, { variant: "caption", color: "gray", className: "text-lg", children: "\uC81C\uCD9C \uC2DC\uAC04" }), _jsxs("div", { className: "mt-2 space-y-2 text-base", children: [_jsxs("div", { children: [_jsx("span", { className: "font-bold mr-2", children: fileA.label }), _jsx("span", { className: "text-blue-500", children: fileA.submittedAt })] }), _jsxs("div", { children: [_jsx("span", { className: "font-bold mr-2", children: fileB.label }), _jsx("span", { className: "text-blue-500", children: fileB.submittedAt })] })] })] })] }), _jsx("div", { className: "underline text-base cursor-pointer w-fit", onClick: () => navigate(-1), children: "\uCF54\uB4DC \uBE44\uAD50 \uB2E4\uC2DC \uBCF4\uAE30" }), _jsxs("div", { className: "flex justify-center gap-8 pt-12", children: [_jsx(Button, { text: "\uD45C\uC808 \uC544\uB2D8", variant: "secondary", onClick: () => handleDecision(false) }), _jsx(Button, { text: "\uD45C\uC808\uB85C \uC800\uC7A5", variant: "danger", onClick: () => handleDecision(true) })] })] }) }));
};
export default PlagiarismDecisionPage;
