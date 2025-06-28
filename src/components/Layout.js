import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from './layout/Header';
import Footer from './layout/Footer';
import Content from './layout/Content';
const Layout = ({ title, description, children, contentClassName, }) => {
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-gray-50", children: [_jsx(Header, {}), _jsx(Content, { title: title, description: description, className: contentClassName, children: children }), _jsx(Footer, {})] }));
};
export default Layout;
