import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
const TYPE_CLASSES = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white',
};
const Notification = ({ message, type = 'info', }) => {
    return (_jsx("div", { className: classNames('p-4 rounded-lg mb-4', TYPE_CLASSES[type]), children: message }));
};
export default Notification;
