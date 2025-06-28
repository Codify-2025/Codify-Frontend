import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import Text from '@components/Text';
const SavedAnalysisItem = ({ record }) => {
    const navigate = useNavigate();
    if (record.type === 'group') {
        return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "cursor-pointer border rounded p-4 hover:shadow transition w-full h-64 flex flex-col justify-center", onClick: () => navigate(`/result`, {
                        state: { fromSaved: true, recordId: record.id },
                    }), children: _jsx("div", { className: "h-full w-full bg-gray-100 rounded flex items-center justify-center text-gray-400", children: "\uB124\uD2B8\uC6CC\uD06C \uD1A0\uD3F4\uB85C\uC9C0 \uBBF8\uB9AC\uBCF4\uAE30" }) }), _jsxs("p", { className: "text-center mt-2 text-sm text-gray-600 w-full", children: ["<", record.assignmentName, "> \uC804\uCCB4 \uD30C\uC77C \uBD84\uC11D \uACB0\uACFC"] })] }));
    }
    return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "cursor-pointer border rounded p-4 hover:shadow transition w-full h-64 flex flex-col justify-between", onClick: () => {
                    navigate(`/compare/${String(record.fileA.id)}/${String(record.fileB?.id)}`, {
                        state: { fromSaved: true, recordId: record.id },
                    });
                }, children: [_jsx("div", { className: "text-center", children: _jsxs(Text, { variant: "body", weight: "bold", className: "text-red-600 text-xl", children: ["\uC720\uC0AC\uB3C4 ", record.similarity, "%"] }) }), _jsxs("div", { className: "flex flex-col items-start gap-2 text-sm text-gray-700", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: record.fileA.label }), ' ', _jsx("span", { className: "text-blue-600", children: record.fileA.submittedAt })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: record.fileB.label }), ' ', _jsx("span", { className: "text-blue-600", children: record.fileB.submittedAt })] })] }), _jsx("div", { className: "h-4" })] }), _jsxs("p", { className: "text-center mt-2 text-sm text-gray-600 w-full", children: ["<", record.assignmentName, "> ", record.fileA.label, "-", record.fileB.label, " \uCF54\uB4DC \uBE44\uAD50 \uACB0\uACFC"] })] }));
};
export default SavedAnalysisItem;
