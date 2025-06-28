import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
const Toggle = ({ checked, onChange, label }) => {
    return (_jsxs("label", { className: "flex items-center cursor-pointer space-x-3", children: [label && (_jsx("span", { className: "text-gray-700 text-sm font-medium", children: label })), _jsx("div", { className: classNames('w-10 h-6 flex items-center rounded-full p-1 transition-colors', checked ? 'bg-blue-500' : 'bg-gray'), onClick: onChange, children: _jsx("div", { className: classNames('bg-white w-4 h-4 rounded-full shadow-md transform transition-transform', checked ? 'translate-x-4' : 'translate-x-0') }) })] }));
};
export default Toggle;
