import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
const Tooltip = ({ content, children }) => {
    const id = useId(); // 유일한 id 생성
    return (_jsxs(_Fragment, { children: [_jsx("span", { "data-tooltip-id": id, className: "cursor-help inline-block align-middle", children: children }), _jsx(ReactTooltip, { id: id, place: "top", content: content, className: "text-xs z-50" })] }));
};
export default Tooltip;
