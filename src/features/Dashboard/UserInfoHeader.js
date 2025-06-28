import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Button from '@components/Button';
import { FiEdit2 } from 'react-icons/fi';
import BirthdateEditModal from './BirthdateEditModal';
import { useSubjectStore } from '@stores/subjectStore';
const UserInfoHeader = () => {
    const [isSubjectOpen, setSubjectOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [birthdate, setBirthdate] = useState('2000-01-01');
    const [tempBirthdate, setTempBirthdate] = useState(birthdate);
    const { setSelectedSubject } = useSubjectStore();
    const user = {
        name: '사용자명',
        id: '아이디',
        testCount: 3,
        subjects: [
            { name: '프로그래밍 입문', code: '001' },
            { name: '공학 수학', code: '002' },
        ],
    };
    const openModal = () => {
        setTempBirthdate(birthdate); // 기존 생년월일 초기값
        setModalOpen(true);
    };
    const handleSaveBirthdate = () => {
        setBirthdate(tempBirthdate);
        setModalOpen(false);
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-8 pt-10 pb-4 relative", children: [_jsx("div", { className: "absolute top-10 right-8", children: _jsx(Button, { text: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD\uD558\uAE30", variant: "secondary", size: "medium" }) }), _jsxs("div", { className: "flex items-end gap-2 mb-4", children: [_jsx("h1", { className: "text-3xl font-bold", children: user.name }), _jsxs("span", { className: "text-lg text-gray-600 font-normal", children: ["(", user.id, ")"] })] }), _jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("div", { className: "border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700", children: birthdate }), _jsx("button", { onClick: openModal, className: "text-gray-500 hover:text-black", children: _jsx(FiEdit2, { size: 16 }) })] }), _jsxs("p", { className: "text-sm text-gray-700 mb-4", children: ["\uC9C4\uD589\uD55C \uC720\uC0AC\uB3C4 \uAC80\uC0AC \uD69F\uC218:", ' ', _jsxs("span", { className: "text-blue-600 font-semibold", children: [user.testCount, "\uD68C"] })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("button", { onClick: () => setSubjectOpen(!isSubjectOpen), className: "border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 hover:bg-gray-50", children: ["\uAD00\uB9AC \uC911\uC778 \uACFC\uBAA9 ", isSubjectOpen ? '▲' : '▼'] }), isSubjectOpen && (_jsx("div", { className: "mt-2 border border-gray-300 rounded-md overflow-hidden w-fit text-sm text-gray-800", children: user.subjects.map((subj, idx) => (_jsxs("div", { onClick: () => setSelectedSubject(subj), className: `px-4 py-2 ${idx !== user.subjects.length - 1 ? 'border-b border-gray-300' : ''}`, children: [subj.name, " (", subj.code, ")"] }, subj.code))) }))] }), _jsx("hr", { className: "border-t border-gray-300" }), isModalOpen && (_jsx(BirthdateEditModal, { value: tempBirthdate, onChange: setTempBirthdate, onClose: () => setModalOpen(false), onSave: handleSaveBirthdate }))] }));
};
export default UserInfoHeader;
