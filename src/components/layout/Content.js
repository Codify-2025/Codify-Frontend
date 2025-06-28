import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Text from '../Text';
const Content = ({ title, description, children, className, }) => {
    return (_jsxs("main", { className: `flex-1 p-6 ${className ?? 'bg-gray-100'}`, children: [title && (_jsx(Text, { variant: "heading", weight: "bold", color: "primary", className: "mb-4", children: title })), description && (_jsx(Text, { variant: "body", weight: "regular", color: "gray", className: "mb-6", children: description })), children] }));
};
export default Content;
