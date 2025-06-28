import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import Text from './Text';
const Card = ({ title, children, footer, className }) => {
    return (_jsxs("div", { className: classNames('bg-white rounded-lg shadow-md p-4', className), children: [title && (_jsx(Text, { variant: "heading", weight: "bold", color: "gray", className: "mb-2", children: title })), _jsx("div", { className: "mb-4", children: children }), footer && _jsx("div", { className: "border-t pt-2 mt-2", children: footer })] }));
};
export default Card;
