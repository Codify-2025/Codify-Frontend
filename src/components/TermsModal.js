import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createPortal } from 'react-dom';
import Text from '@components/Text';
import Button from '@components/Button';
const TermsModal = ({ title, content, onClose }) => {
    return createPortal(_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4", children: _jsxs("div", { className: "bg-white rounded-lg max-w-lg w-full p-6 space-y-6", children: [_jsx(Text, { variant: "heading", weight: "bold", className: "text-xl", children: title }), _jsx("div", { className: "text-sm text-gray-700 max-h-60 overflow-y-auto whitespace-pre-line", children: content }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { text: "\uB2EB\uAE30", onClick: onClose }) })] }) }), document.body);
};
export default TermsModal;
