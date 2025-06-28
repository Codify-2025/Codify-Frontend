import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import Select from '@components/Select';
import Tooltip from '@components/Tooltip';
import { useSelectedFileStore } from '@stores/useSelectedFileStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSavedRecordStore } from '@stores/useSavedRecordStore';
import { useAuthStore } from '@stores/useAuthStore';
const getLineStyleBySimilarity = (similar) => {
    if (similar.length >= 2)
        return 'bg-red-100'; // 유사한 코드 (다수)
    if (similar.length === 1)
        return 'bg-green-100'; // 구조 유사 코드 (단일)
    return '';
};
const ComparePage = () => {
    const navigate = useNavigate();
    const { files, selectedFileA, selectedFileB, setSelectedFiles } = useSelectedFileStore();
    const location = useLocation();
    const fromSaved = location.state?.fromSaved;
    const recordId = location.state?.recordId;
    const { isLoggedIn } = useAuthStore();
    const handleSave = () => {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: 'result' } });
            return;
        }
        else {
            navigate('/decision', {
                state: {
                    fileA: selectedFileA,
                    fileB: selectedFileB,
                    similarity: 0.95, // 임시. 나중엔 비교 결과에서 실제 유사도 계산 결과로 대체
                },
            });
        }
        // TODO: 실제 저장 로직
        console.log('저장 진행...');
    };
    useEffect(() => {
        if (fromSaved && recordId) {
            useSavedRecordStore.getState().selectRecordById(recordId);
            const selected = useSavedRecordStore.getState().selectedRecord;
            if (selected && selected.type === 'pair' && selected.fileB) {
                useSelectedFileStore
                    .getState()
                    .setSelectedFiles(selected.fileA, selected.fileB);
            }
        }
    }, [fromSaved, recordId]);
    if (!selectedFileA || !selectedFileB) {
        return (_jsx(Layout, { children: _jsxs("div", { className: "px-8 py-10", children: [_jsx(Text, { variant: "heading", weight: "bold", className: "text-xl mb-4", children: "\uC120\uD0DD\uB41C \uD30C\uC77C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }), _jsx(Button, { text: "\uACB0\uACFC \uD398\uC774\uC9C0\uB85C \uB3CC\uC544\uAC00\uAE30", onClick: () => navigate('/result') })] }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-7xl mx-auto px-8 py-10 space-y-6 text-base", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsx(Button, { text: "\uC774\uC804\uC73C\uB85C", variant: "secondary", icon: _jsx("span", { className: "text-lg", children: "\u2190" }), iconPosition: "left", onClick: () => navigate('/result') }) }), _jsxs(Text, { variant: "heading", weight: "bold", className: "text-3xl text-black", children: [selectedFileA.label, " \uC640 ", selectedFileB.label, "\uC758 \uCF54\uB4DC \uBE44\uAD50"] }), _jsx("div", { className: "grid grid-cols-2 gap-8", children: [selectedFileA, selectedFileB].map((file, idx) => {
                        const other = idx === 0 ? selectedFileB : selectedFileA;
                        const options = files
                            .filter((f) => f.id !== other?.id)
                            .map((f) => ({ label: f.label, value: f.id }));
                        return (_jsxs("div", { children: [_jsx(Select, { options: options, value: file.id, onChange: (val) => {
                                        // 같은 파일 선택 방지 (예외 방어)
                                        if (val === other?.id)
                                            return;
                                        const newFile = files.find((f) => f.id === val);
                                        if (!newFile)
                                            return;
                                        if (idx === 0) {
                                            setSelectedFiles(newFile, other);
                                        }
                                        else {
                                            setSelectedFiles(other, newFile);
                                        }
                                    } }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: ["\uC81C\uCD9C \uC2DC\uAC04: ", file.submittedAt] })] }, file.id));
                    }) }), _jsxs("div", { className: "border rounded overflow-hidden mt-6", children: [_jsxs("div", { className: "grid grid-cols-2 text-center font-bold text-lg bg-gray-100 border-b", children: [_jsx("div", { className: "py-3", children: selectedFileA.label }), _jsx("div", { className: "py-3", children: selectedFileB.label })] }), selectedFileA.content.map((lineA, idx) => {
                            const lineB = selectedFileB.content[idx] || '';
                            const similarA = selectedFileA.similarMap[idx + 1] || [];
                            const similarB = selectedFileB.similarMap[idx + 1] || [];
                            return (_jsx("div", { className: "grid grid-cols-2 text-sm border-b", children: [
                                    { line: lineA, similar: similarA },
                                    { line: lineB, similar: similarB },
                                ].map(({ line, similar }, i) => {
                                    const otherFileNames = [
                                        selectedFileA.label,
                                        selectedFileB.label,
                                    ];
                                    const filteredSimilar = similar.filter((name) => !otherFileNames.includes(name));
                                    return (_jsxs("div", { className: `py-2 px-3 ${getLineStyleBySimilarity(filteredSimilar)} border-r ${i === 1 ? 'border-r-0' : ''}`, children: [_jsx(Tooltip, { content: filteredSimilar.length > 0
                                                    ? `유사한 다른 제출자: ${filteredSimilar.join(', ')}`
                                                    : '유사한 제출자 없음', children: _jsx("span", { className: `text-gray-500 mr-2 ${filteredSimilar.length > 0
                                                        ? 'text-blue-500 font-semibold underline decoration-dotted'
                                                        : ''}`, children: idx + 1 }) }), line] }, i));
                                }) }, idx));
                        })] }), _jsxs("div", { className: "flex justify-center mt-10 space-x-4", children: [_jsx(Button, { text: "\uAC80\uC0AC \uC885\uB8CC\uD558\uAE30", variant: "secondary", onClick: () => navigate('/') }), _jsx(Button, { text: "\uACB0\uACFC \uC800\uC7A5\uD558\uAE30", variant: "primary", onClick: handleSave })] })] }) }));
};
export default ComparePage;
