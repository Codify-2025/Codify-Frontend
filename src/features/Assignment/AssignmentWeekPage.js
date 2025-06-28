import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import Toggle from '@components/Toggle';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAssignmentStore } from '@stores/assignmentStore';
const getWeekNumber = (date) => {
    const copied = new Date(date.getTime());
    copied.setDate(1);
    const firstDay = copied.getDay();
    return Math.ceil((date.getDate() + firstDay) / 7);
};
const getAssignmentWeek = (start) => {
    const month = start.getMonth() + 1;
    const week = getWeekNumber(start);
    const mapping = {
        3: 1,
        4: 5,
        5: 9,
        6: 13,
        9: 1,
        10: 5,
        11: 9,
        12: 13,
    };
    const base = mapping[month];
    return base ? base + (week - 1) : 1;
};
const AssignmentWeekPage = () => {
    const { name: assignmentName, setDates, setWeek } = useAssignmentStore();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [manualWeek, setManualWeek] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState('');
    const navigate = useNavigate();
    const calculatedWeek = startDate ? getAssignmentWeek(startDate) : 1;
    const handleNext = () => {
        const weekNumber = manualWeek ? Number(selectedWeek) : calculatedWeek;
        if (!startDate || !endDate)
            return;
        if (manualWeek && (!selectedWeek || isNaN(weekNumber) || weekNumber < 1)) {
            alert('주차를 1 이상의 숫자로 입력해주세요.');
            return;
        }
        setDates(startDate, endDate);
        setWeek(weekNumber);
        navigate('/upload');
    };
    return (_jsx(Layout, { children: _jsxs("div", { className: "flex flex-col items-start justify-start px-6 py-16 space-y-8 w-full max-w-xl mx-auto", children: [_jsxs(Text, { variant: "caption", weight: "bold", className: "text-black text-lg", children: [_jsx("span", { className: "text-blue-500", children: assignmentName }), " \uACFC\uC81C \uC720\uC0AC\uB3C4 \uBD84\uC11D \uC9C4\uD589"] }), _jsx(Text, { variant: "body", weight: "medium", className: "text-gray-400 text-xl", children: "2. \uC8FC\uCC28 \uC120\uD0DD" }), _jsx(Text, { variant: "heading", weight: "bold", className: "text-black text-2xl mt-2", children: "\uACFC\uC81C \uC2DC\uC791\uC77C\uACFC \uB9C8\uAC10\uC77C\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694" }), _jsxs("div", { className: "flex gap-6 w-full max-w-md", children: [_jsxs("div", { className: "flex flex-col flex-1", children: [_jsx("label", { className: "text-gray-600 mb-1", children: "\uC2DC\uC791\uC77C" }), _jsx(DatePicker, { selected: startDate, onChange: (date) => setStartDate(date), selectsStart: true, startDate: startDate, endDate: endDate, className: "border px-3 py-2 rounded-md w-full", placeholderText: "\uC2DC\uC791\uC77C \uC120\uD0DD" })] }), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx("label", { className: "text-gray-600 mb-1", children: "\uB9C8\uAC10\uC77C" }), _jsx(DatePicker, { selected: endDate, onChange: (date) => setEndDate(date), selectsEnd: true, startDate: startDate, endDate: endDate, minDate: startDate || new Date(), className: "border px-3 py-2 rounded-md w-full", placeholderText: "\uB9C8\uAC10\uC77C \uC120\uD0DD" })] })] }), _jsxs("div", { className: "flex items-center justify-between w-full max-w-md mt-4", children: [_jsx(Text, { variant: "body", weight: "medium", className: "text-blue-500 text-lg", children: manualWeek
                                ? `${selectedWeek}주차 (수동 설정)`
                                : `${calculatedWeek}주차 (자동 설정)` }), _jsx(Toggle, { label: "\uC218\uB3D9 \uC870\uC815", checked: manualWeek, onChange: () => setManualWeek((prev) => !prev) })] }), manualWeek && (_jsx("div", { className: "w-full max-w-md", children: _jsx("input", { type: "number", inputMode: "numeric", value: selectedWeek, onChange: (e) => setSelectedWeek(e.target.value), placeholder: "\uC8FC\uCC28 \uC785\uB825 (1 \uC774\uC0C1)", className: "border px-3 py-2 rounded-md w-full mt-2" }) })), _jsx("div", { className: "self-end pt-20", children: _jsx(Button, { text: "\uB2E4\uC74C", variant: "primary", onClick: handleNext, disabled: !startDate || !endDate, iconPosition: "right", icon: _jsx("span", { className: "ml-1", children: "\u2192" }) }) })] }) }));
};
export default AssignmentWeekPage;
