import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
const VARIANT_STYLES = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray hover:bg-gray-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    custom: '',
};
const SIZE_STYLES = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
};
const Button = ({ text, loadingText, variant = 'primary', size = 'medium', icon, iconPosition = 'left', isLoading = false, disabled = false, className = '', onClick, }) => {
    const buttonClass = classNames('flex items-center justify-center rounded-lg transition duration-200', VARIANT_STYLES[variant], SIZE_STYLES[size], {
        'opacity-50 cursor-not-allowed': disabled || isLoading,
    }, className);
    return (_jsx("button", { className: buttonClass, onClick: onClick, disabled: disabled || isLoading, children: isLoading ? (_jsx("span", { children: loadingText ? loadingText : 'Loading...' })) : (_jsxs(_Fragment, { children: [icon && iconPosition === 'left' && (_jsx("span", { className: "mr-2", children: icon })), text, icon && iconPosition === 'right' && (_jsx("span", { className: "ml-2", children: icon }))] })) }));
};
export default Button;
