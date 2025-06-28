import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from '@components/Button';
const BirthdateEditModal = ({ value, onChange, onClose, onSave, }) => {
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-sm p-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "\uC0DD\uB144\uC6D4\uC77C \uC218\uC815" }), _jsx("input", { type: "date", value: value, onChange: (e) => onChange(e.target.value), className: "w-full border border-gray-300 rounded px-3 py-2 mb-4" }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { text: "\uCDE8\uC18C", variant: "secondary", size: "small", onClick: onClose }), _jsx(Button, { text: "\uC800\uC7A5", variant: "primary", size: "small", onClick: onSave })] })] }) }));
};
export default BirthdateEditModal;
