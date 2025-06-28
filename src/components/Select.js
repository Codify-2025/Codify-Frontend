import { jsx as _jsx } from "react/jsx-runtime";
const Select = ({ options, value, onChange }) => {
    return (_jsx("select", { className: "w-full border border-gray-300 rounded px-3 py-2 bg-white shadow-sm text-sm", value: value, onChange: (e) => onChange(e.target.value), children: options.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) }));
};
export default Select;
