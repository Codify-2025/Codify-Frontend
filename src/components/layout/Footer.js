import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import Text from '../Text';
const Footer = () => {
    return (_jsx("footer", { className: "bg-gray-800 p-4 mt-auto flex justify-center items-center", children: _jsxs(Text, { variant: "caption", weight: "regular", color: "gray", children: ["\u00A9 ", new Date().getFullYear(), " Codify - All Rights Reserved."] }) }));
};
export default Footer;
