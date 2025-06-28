import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
const COLOR_STYLES = {
    primary: 'text-blue-500',
    secondary: 'text-gray-500',
    danger: 'text-red-500',
    gray: 'text-gray-500',
    white: 'text-white',
};
const VARIANT_STYLES = {
    heading: 'text-heading',
    subtitle: 'text-subtitle',
    body: 'text-body',
    caption: 'text-caption',
};
const WEIGHT_STYLES = {
    regular: 'font-regular',
    medium: 'font-medium',
    bold: 'font-bold',
};
const Text = ({ variant = 'body', weight = 'regular', color = 'gray', children, className = '', }) => {
    const textClass = classNames(VARIANT_STYLES[variant], WEIGHT_STYLES[weight], COLOR_STYLES[color], className);
    return _jsx("p", { className: textClass, children: children });
};
export default Text;
