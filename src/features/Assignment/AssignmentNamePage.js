import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import { useAssignmentStore } from '@stores/assignmentStore';
const AssignmentNamePage = () => {
    const [name, setNameInput] = useState('');
    const navigate = useNavigate();
    const { setName } = useAssignmentStore();
    const handleNext = () => {
        if (name.trim()) {
            setName(name.trim());
            navigate('/assignment/week');
        }
    };
    return (_jsx(Layout, { children: _jsxs("div", { className: "flex flex-col items-start justify-center px-6 py-16 space-y-8 w-full max-w-xl mx-auto", children: [_jsx(Text, { variant: "caption", weight: "bold", className: "text-black text-lg", children: "\uC720\uC0AC\uB3C4 \uBD84\uC11D \uC9C4\uD589" }), _jsx(Text, { variant: "body", weight: "medium", className: "text-gray-400 text-xl", children: "1. \uACFC\uC81C \uC0DD\uC131" }), _jsx(Text, { variant: "heading", weight: "bold", className: "text-black text-2xl mt-2", children: "\uACFC\uC81C\uBA85\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694" }), _jsx("div", { className: "flex items-center border-b border-gray-300 w-full max-w-md", children: _jsx("input", { type: "text", placeholder: "\uACFC\uC81C\uBA85", value: name, onChange: (e) => setNameInput(e.target.value), className: "flex-grow py-3 px-1 focus:outline-none text-xl placeholder:text-gray-400" }) }), _jsx("div", { className: "self-end pt-20", children: _jsx(Button, { text: "\uB2E4\uC74C", variant: "primary", onClick: handleNext, disabled: !name.trim(), iconPosition: "right", icon: _jsx("span", { className: "ml-1", children: "\u2192" }) }) })] }) }));
};
export default AssignmentNamePage;
