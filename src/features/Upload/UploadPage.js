import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Layout from '@components/Layout';
import FileUpload from './FileUpload';
import Text from '@components/Text';
import Button from '@components/Button';
import { useAssignmentStore } from '@stores/assignmentStore';
import { useNavigate } from 'react-router-dom';
const UploadPage = () => {
    const navigate = useNavigate();
    const { name, week } = useAssignmentStore();
    const handleStartAnalysis = () => {
        navigate('/analysis/loading');
    };
    return (_jsx(Layout, { children: _jsxs("div", { className: "flex flex-col items-center p-8 space-y-4", children: [_jsxs(Text, { variant: "caption", weight: "bold", className: "text-black text-lg text-center", children: [_jsx("span", { className: "text-blue-500", children: name }), _jsx("span", { className: "text-gray", children: week ? ` (${week}주차)` : '' }), " \uACFC\uC81C \uD30C\uC77C \uC720\uC0AC\uB3C4 \uAC80\uC0AC"] }), _jsx(Text, { variant: "heading", weight: "bold", className: "text-gray-700", children: "\uAC80\uC0AC\uB97C \uC9C4\uD589\uD560 \uD30C\uC77C\uC744 \uC5C5\uB85C\uB4DC \uD574\uC8FC\uC138\uC694" }), _jsx(Text, { variant: "body", weight: "regular", className: "text-gray-500", children: "\uAC1C\uBCC4 \uD30C\uC77C \uB610\uB294 \uC555\uCD95 \uD30C\uC77C(.zip)\uC744 \uC5C5\uB85C\uB4DC\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }), _jsxs("div", { className: "bg-blue-50 text-blue-600 text-sm p-3 rounded-lg shadow-sm w-full max-w-lg", children: ["\u203B \uC5C5\uB85C\uB4DC \uAC00\uB2A5\uD55C \uD30C\uC77C \uD615\uC2DD:", ' ', _jsx("span", { className: "font-bold", children: ".cpp, .zip" })] }), _jsx(FileUpload, {}), _jsx(Button, { text: "\uBD84\uC11D \uC2DC\uC791", variant: "primary", className: "mt-4", onClick: handleStartAnalysis })] }) }));
};
export default UploadPage;
