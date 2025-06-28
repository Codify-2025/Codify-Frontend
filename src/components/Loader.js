import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
const SIZE_CLASSES = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
};
const COLOR_CLASSES = {
    primary: 'border-blue-500',
    secondary: 'border-green-500',
    gray: 'border-gray-500',
};
const Loader = ({ size = 'medium', color = 'primary', }) => {
    return (_jsx("div", { className: classNames('border-4 border-t-transparent rounded-full animate-spin', SIZE_CLASSES[size], COLOR_CLASSES[color]) }));
};
export default Loader;
