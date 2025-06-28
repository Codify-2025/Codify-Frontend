import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useMemo } from 'react';
import Layout from '@components/Layout';
import Text from '@components/Text';
import Button from '@components/Button';
import SimilarityPieChart from './SimilarityPieChart';
import SimilarityGraph from './SimilarityGraph';
import { useAssignmentStore } from '@stores/assignmentStore';
import { useSelectedFileStore } from '@stores/useSelectedFileStore';
import { useNavigate } from 'react-router-dom';
import { dummyFiles } from '@constants/dummyFiles';
import { useLocation } from 'react-router-dom';
import { useSavedRecordStore } from '@stores/useSavedRecordStore';
import { useAuthStore } from '@stores/useAuthStore';
const ResultPage = () => {
    const { name, week } = useAssignmentStore();
    const navigate = useNavigate();
    const { setFiles, setSelectedFiles } = useSelectedFileStore();
    const [hoverInfo, setHoverInfo] = useState(null);
    const [hoveredFiles, setHoveredFiles] = useState([]);
    const nodes = useMemo(() => dummyFiles, []);
    const edges = useMemo(() => [
        { id: '1-2', from: '1', to: '2', similarity: 92 },
        { id: '1-3', from: '1', to: '3', similarity: 87 },
        { id: '2-3', from: '2', to: '3', similarity: 75 },
    ], []);
    const location = useLocation();
    const fromSaved = location.state?.fromSaved;
    const recordId = location.state?.recordId;
    const { isLoggedIn } = useAuthStore();
    const handleSave = () => {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: 'result' } });
            return;
        }
        // TODO: 실제 저장 로직
        console.log('결과 저장 진행');
    };
    useEffect(() => {
        if (fromSaved && recordId) {
            useSavedRecordStore.getState().selectRecordById(recordId);
            const selected = useSavedRecordStore.getState().selectedRecord;
            if (selected && selected.type === 'network') {
                useSelectedFileStore.getState().setFiles(selected.nodes ?? []);
            }
        }
    }, [fromSaved, recordId]);
    useEffect(() => {
        if (!fromSaved) {
            setFiles(dummyFiles);
        }
    }, [fromSaved, setFiles]);
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-7xl mx-auto px-8 py-10 text-base", children: [_jsxs("h1", { className: "text-4xl font-bold text-black mb-10", children: [_jsxs("span", { className: "text-blue-500", children: [name, " (", week, "\uC8FC\uCC28)"] }), ' ', "\uC720\uC0AC\uB3C4 \uBD84\uC11D \uACB0\uACFC"] }), _jsxs("div", { className: "grid grid-cols-2 gap-8 mb-12", children: [_jsx("div", { className: "bg-white p-4 rounded shadow", children: _jsx(SimilarityPieChart, { passedCount: 2, failedCount: 1, onHover: (segment) => {
                                    const target = segment === '기준 초과' ? nodes.slice(0, 2) : nodes.slice(2);
                                    setHoveredFiles(target);
                                } }) }), _jsx("div", { className: "bg-blue-50 text-blue-700 p-4 rounded shadow whitespace-pre-line text-lg", children: hoveredFiles.length > 0
                                ? hoveredFiles
                                    .map((f) => `📄 ${f.label} (${f.submittedAt})`)
                                    .join('\n')
                                : '파이차트에서 항목에 마우스를 올리면 관련 파일이 여기에 표시됩니다.' })] }), _jsxs("div", { className: "mb-3", children: [_jsx(Text, { variant: "body", weight: "bold", className: "text-xl mb-2", children: "\uC720\uC0AC\uB3C4 \uB124\uD2B8\uC6CC\uD06C" }), _jsx("div", { className: "bg-white p-4 rounded shadow", children: _jsx(SimilarityGraph, { nodes: nodes, edges: edges, interactionOptions: {
                                    zoomView: false,
                                    dragView: false,
                                    dragNodes: false,
                                }, onNodeHover: (node) => {
                                    const connectedFiles = edges
                                        .filter((e) => e.from === node.id || e.to === node.id)
                                        .map((e) => {
                                        const otherId = e.from === node.id ? e.to : e.from;
                                        return nodes.find((n) => n.id === otherId);
                                    })
                                        .filter(Boolean);
                                    setHoverInfo([
                                        `📄 파일명: ${node.label}`,
                                        `🕒 제출 시간: ${node.submittedAt}`,
                                        '',
                                        `🔗 연결된 유사 파일:`,
                                        ...connectedFiles.map((n) => `• ${n?.label}`),
                                    ].join('\n'));
                                }, onEdgeHover: (edge) => {
                                    const from = nodes.find((n) => n.id === edge.from);
                                    const to = nodes.find((n) => n.id === edge.to);
                                    if (from && to) {
                                        setHoverInfo(`🔗 유사도: ${edge.similarity}%\n📁 ${from.label} - ${to.label}\n🕒 ${from.submittedAt} / ${to.submittedAt}`);
                                    }
                                }, onEdgeClick: (edge) => {
                                    const fileA = nodes.find((n) => n.id === edge.from);
                                    const fileB = nodes.find((n) => n.id === edge.to);
                                    if (fileA && fileB) {
                                        setSelectedFiles(fileA, fileB);
                                        navigate(`/compare/${String(fileA.id)}/${String(fileB.id)}`);
                                    }
                                } }) })] }), _jsx("div", { className: "bg-blue-50 text-blue-700 p-4 rounded text-lg whitespace-pre-line shadow mb-8", children: hoverInfo ||
                        '그래프에서 노드(파일)나 엣지(유사도)를 선택하면 상세 정보가 여기에 표시됩니다.' }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { text: "\uACB0\uACFC \uC800\uC7A5\uD558\uAE30", variant: "primary", onClick: handleSave }) })] }) }));
};
export default ResultPage;
