import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Text from '@components/Text';
import Button from '@components/Button';
import Layout from '@components/Layout';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    // ResultPage, Dashboard 등에서 넘어온 경우 구분
    const from = location.state?.from ?? '/';
    const fromResultPage = from === 'result' || from === 'compare';
    const fromDashboard = from === '/dashboard';
    // 상황별 문구 지정
    const headline = fromResultPage
        ? '로그인하여 분석 결과 저장하기'
        : fromDashboard
            ? '대시보드 이용을 위해 로그인해주세요'
            : 'Codify 로그인';
    const subtext = fromResultPage
        ? '로그인이 필요한 서비스입니다.'
        : fromDashboard
            ? '분석 기록과 대시보드를 보기 위해 로그인하세요.'
            : '더 많은 서비스를 위해 로그인해주세요.';
    const handleLogin = () => {
        console.log('로그인 시도:', { email, password });
        // 로그인 성공 시 원래 경로로 이동
        if (fromResultPage) {
            navigate(-1); // Result 또는 Compare 페이지로
        }
        else {
            navigate(from, { replace: true }); // 대시보드 or 홈 등
        }
        // TODO: 실제 로그인 API 연동
    };
    return (_jsx(Layout, { children: _jsxs("div", { className: "flex h-screen", children: [_jsxs("div", { className: "flex-1 flex flex-col justify-center items-center px-8 space-y-5", children: [_jsx(Text, { variant: "body", className: "text-lg text-gray-700", children: subtext }), _jsx(Text, { variant: "heading", weight: "bold", className: "text-3xl text-black", children: headline }), _jsx("input", { type: "email", placeholder: "\uC774\uBA54\uC77C\uC744 \uC785\uB825\uD558\uC138\uC694", className: "w-full max-w-sm border border-gray-300 rounded px-4 py-3 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black", value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("input", { type: "password", placeholder: "\uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD558\uC138\uC694", className: "w-full max-w-sm border border-gray-300 rounded px-4 py-3 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black", value: password, onChange: (e) => setPassword(e.target.value) }), _jsx(Button, { text: "\uACC4\uC18D", onClick: handleLogin, className: "w-full max-w-sm mt-2 bg-black text-white" }), _jsx("div", { className: "my-3 w-full max-w-sm border-t" }), _jsxs("div", { className: "text-xs text-gray-600 text-center space-y-2", children: [_jsxs("div", { children: ["\uACC4\uC815\uC774 \uC5C6\uC73C\uC2E0\uAC00\uC694?", ' ', _jsx("a", { href: "/signup", className: "underline font-medium", children: "\uAC00\uC785\uD558\uAE30" })] }), _jsx("div", { children: _jsx("a", { href: "/reset-password", className: "underline font-medium", children: "\uBE44\uBC00\uBC88\uD638 \uCC3E\uAE30" }) })] })] }), _jsx("div", { className: "hidden md:flex flex-1 justify-center items-center bg-white", children: _jsx("img", { src: "/login-visual.png", alt: "login visual", className: "max-w-md" }) })] }) }));
};
export default LoginPage;
