import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Input = ({ label, placeholder, value, onChange, type = 'text', error, }) => {
    return (_jsxs("div", { className: "mb-4", children: [label && _jsx("label", { className: "block mb-1 text-gray-700", children: label }), _jsx("input", { type: type, placeholder: placeholder, value: value, onChange: onChange, className: "border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }), error && _jsx("p", { className: "text-red-500 mt-1", children: error })] }));
};
export default Input;
