import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from './Button';
import Text from './Text';
const Modal = ({ isOpen, title, onClose, children }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50", children: _jsxs("div", { className: "bg-white p-6 rounded-lg w-80 shadow-lg", children: [title && (_jsx(Text, { variant: "heading", weight: "bold", color: "gray", className: "mb-4", children: title })), _jsx("div", { className: "mb-4", children: children }), _jsx(Button, { text: "\uB2EB\uAE30", variant: "secondary", onClick: onClose })] }) }));
};
export default Modal;
