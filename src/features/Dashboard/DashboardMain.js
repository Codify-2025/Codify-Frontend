import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Text from '@components/Text';
import { useSubjectStore } from '@stores/subjectStore';
import AccumulatedSimilarityGraph from './AccumulatedSimilarityGraph';
import SavedAnalysisSection from './History/SavedAnalysisSection';
import { useEffect } from 'react';
import { dummySavedRecords } from '@constants/dummySavedRecords';
import { useSavedRecordStore } from '@stores/useSavedRecordStore';
const DashboardMain = () => {
    const { selectedSubject } = useSubjectStore();
    useEffect(() => {
        useSavedRecordStore.getState().setRecords(dummySavedRecords);
    }, []);
    return (_jsx("div", { className: "max-w-7xl mx-auto px-8 py-4", children: !selectedSubject ? (
        // 과목 미선택 시 안내 텍스트
        _jsx("div", { className: "flex items-center justify-center h-64", children: _jsx(Text, { variant: "heading", weight: "bold", className: "text-xl text-gray-500 text-center", children: "\uACFC\uBAA9 \uC120\uD0DD \uC2DC \uD574\uB2F9 \uACFC\uBAA9\uC758 \uC720\uC0AC\uB3C4 \uBD84\uC11D \uAE30\uB85D\uC744 \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }) })) : (
        // 과목 선택 시 콘텐츠 표시
        _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-lg text-gray-700 font-semibold text-center", children: ["\uC120\uD0DD\uB41C \uACFC\uBAA9:", ' ', _jsx("span", { className: "text-blue-600", children: selectedSubject.name })] }), _jsxs("section", { children: [_jsx(Text, { variant: "heading", weight: "bold", className: "text-xl mb-4", children: "\uB204\uC801 \uB124\uD2B8\uC6CC\uD06C \uD1A0\uD3F4\uB85C\uC9C0" }), _jsx(AccumulatedSimilarityGraph, {})] }), _jsx("section", { children: _jsx(SavedAnalysisSection, {}) })] })) }));
};
export default DashboardMain;
