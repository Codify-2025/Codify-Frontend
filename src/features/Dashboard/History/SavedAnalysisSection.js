import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import Text from '@components/Text';
import { savedAnalysisRecords } from './SavedAnalysisDummy';
import SavedAnalysisItem from './SavedAnalysisItem';
const SavedAnalysisSection = () => {
    const [sortOption, setSortOption] = useState('latest');
    const [search, setSearch] = useState('');
    // 정렬된 리스트
    const sorted = useMemo(() => {
        const cloned = [...savedAnalysisRecords];
        if (sortOption === 'similarity') {
            return cloned.sort((a, b) => {
                if (a.type !== 'pair')
                    return 1;
                if (b.type !== 'pair')
                    return -1;
                return b.similarity - a.similarity;
            });
        }
        else {
            return cloned.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        }
    }, [sortOption]);
    // 검색어 필터링
    const filtered = useMemo(() => {
        return sorted.filter((record) => {
            const lower = search.toLowerCase();
            const target = `${record.assignmentName} ${'fileA' in record ? record.fileA.label : ''} ${'fileB' in record ? record.fileB.label : ''}`.toLowerCase();
            return target.includes(lower);
        });
    }, [sorted, search]);
    // 주차별로 그룹핑
    const groupedByWeek = useMemo(() => {
        const map = new Map();
        filtered.forEach((record) => {
            const week = record.week;
            if (!map.has(week))
                map.set(week, []);
            map.get(week).push(record);
        });
        return Array.from(map.entries()).sort((a, b) => a[0] - b[0]); // week 오름차순
    }, [filtered]);
    return (_jsxs("section", { className: "mt-12", children: [_jsx(Text, { variant: "heading", weight: "bold", className: "text-xl mb-4", children: "\uC800\uC7A5\uB41C \uBD84\uC11D \uAE30\uB85D" }), _jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { className: "flex gap-4 text-sm", children: [_jsx("button", { onClick: () => setSortOption('latest'), className: `${sortOption === 'latest'
                                    ? 'text-blue-600 font-semibold'
                                    : 'text-gray-500'}`, children: "\uCD5C\uC2E0\uC21C" }), _jsx("span", { className: "text-gray-300", children: "|" }), _jsx("button", { onClick: () => setSortOption('similarity'), className: `${sortOption === 'similarity'
                                    ? 'text-blue-600 font-semibold'
                                    : 'text-gray-500'}`, children: "\uC720\uC0AC\uB3C4 \uB192\uC740 \uC21C" })] }), _jsxs("div", { className: "relative w-60", children: [_jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "\uACFC\uC81C/\uD559\uC0DD/\uC8FC\uCC28\uBCC4\uB85C \uAC80\uC0C9\uD558\uAE30", className: "p-1 w-full pr-8 border-0 border-b border-gray-400 focus:outline-none focus:ring-0 focus:border-black placeholder-gray-400 text-sm" }), _jsx("span", { className: "absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500", children: "\uD83D\uDD0D" })] })] }), _jsxs("div", { className: "space-y-10", children: [groupedByWeek.map(([week, records]) => (_jsxs("div", { children: [_jsxs("div", { className: "text-center text-lg font-semibold text-gray-800 mb-4", children: [week, "\uC8FC\uCC28"] }), _jsx("div", { className: "grid grid-cols-2 gap-6", children: records.map((record) => (_jsx(SavedAnalysisItem, { record: record }, record.id))) })] }, week))), groupedByWeek.length === 0 && (_jsx("div", { className: "text-center text-gray-400 py-20 text-sm", children: "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }))] })] }));
};
export default SavedAnalysisSection;
