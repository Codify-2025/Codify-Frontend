import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import Text from '@components/Text';
import Button from '@components/Button';
import Layout from '@components/Layout';
const HomePage = () => {
    const navigate = useNavigate();
    return (_jsx(Layout, { contentClassName: "bg-gradient-to-b from-blue-100 via-white to-white", children: _jsx("div", { className: "min-h-screen", children: _jsxs("div", { className: "max-w-6xl mx-auto px-6 py-20 space-y-32", children: [_jsxs("section", { className: "text-center space-y-6", children: [_jsx(Text, { variant: "heading", weight: "bold", className: "text-5xl text-black", children: "\uD83D\uDE80 Codify" }), _jsxs(Text, { variant: "body", className: "text-xl text-gray-700", children: ["\uC81C\uCD9C\uB41C \uCF54\uB4DC \uAC04 \uC720\uC0AC\uB3C4\uB97C \uC2DC\uAC01\uD654\uD558\uACE0", _jsx("br", {}), "\uD45C\uC808 \uAC00\uB2A5\uC131\uC744 \uC27D\uAC8C \uD30C\uC545\uD560 \uC218 \uC788\uB294 \uC2A4\uB9C8\uD2B8\uD55C \uBD84\uC11D \uB3C4\uAD6C\uC785\uB2C8\uB2E4."] }), _jsx("div", { className: "mt-10 flex justify-center", children: _jsx(Button, { text: "\uC720\uC0AC\uB3C4 \uBD84\uC11D \uC2DC\uC791\uD558\uAE30", variant: "primary", className: "text-lg px-10 py-5 text-white text-2xl rounded-lg shadow-lg", onClick: () => navigate('/assignment/name') }) })] }), _jsx("section", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 text-center", children: [
                            {
                                icon: '🔗',
                                title: '유사도 네트워크',
                                desc: '제출자 간 유사도를 시각적으로 보여줍니다.',
                            },
                            {
                                icon: '🧠',
                                title: '코드 비교 뷰어',
                                desc: '두 코드의 구조와 내용을 줄 단위로 비교합니다.',
                            },
                            {
                                icon: '💾',
                                title: '저장 및 관리',
                                desc: '과제별 분석 결과를 저장하고 쉽게 관리하세요.',
                            },
                        ].map((item) => (_jsxs("div", { className: "bg-white rounded-xl shadow p-8 hover:shadow-md transition", children: [_jsx("div", { className: "text-4xl mb-3", children: item.icon }), _jsx("h3", { className: "font-bold text-xl text-gray-800 mb-1", children: item.title }), _jsx("p", { className: "text-sm text-gray-600", children: item.desc })] }, item.title))) }), _jsxs("section", { className: "text-center", children: [_jsx(Text, { variant: "heading", weight: "bold", className: "text-xl mb-2", children: "\uC9C0\uAE08 \uBC14\uB85C Codify\uB97C \uC0AC\uC6A9\uD574\uBCF4\uC138\uC694" }), _jsxs("div", { className: "flex justify-center gap-4 mt-4", children: [_jsx(Button, { text: "\uB85C\uADF8\uC778", onClick: () => navigate('/login') }), _jsx(Button, { text: "\uD68C\uC6D0\uAC00\uC785", onClick: () => navigate('/signup'), variant: "secondary" })] })] })] }) }) }));
};
export default HomePage;
