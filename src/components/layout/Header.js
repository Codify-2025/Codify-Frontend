import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from '../Button';
import Text from '../Text';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@stores/useAuthStore';
const Header = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuthStore();
    return (_jsxs("header", { className: "bg-white p-4 flex justify-between items-center", children: [_jsx("div", { className: "flex items-center space-x-2 cursor-pointer", onClick: () => navigate('/'), children: _jsx(Text, { variant: "heading", weight: "bold", color: "gray", children: "Codify" }) }), _jsxs("div", { className: "flex items-center space-x-4", children: [!isLoggedIn ? (_jsx(Button, { text: "\uB85C\uADF8\uC778", variant: "custom", className: "bg-gray-800 text-black px-4 py-2 rounded-lg", onClick: () => navigate('/login') })) : (_jsx(Button, { text: "\uB85C\uADF8\uC544\uC6C3", variant: "custom", className: "bg-gray-200 text-black px-4 py-2 rounded-lg", onClick: () => {
                            logout();
                            navigate('/');
                        } })), _jsx(Button, { text: "\uB300\uC2DC\uBCF4\uB4DC", variant: "custom", className: "bg-black text-white border border-black px-4 py-2 rounded-lg", 
                        // onClick={() =>
                        //   isLoggedIn
                        //     ? navigate('/dashboard')
                        //     : navigate('/login', { state: { from: '/dashboard' } })
                        // }
                        onClick: () => navigate('/dashboard') })] })] }));
};
export default Header;
