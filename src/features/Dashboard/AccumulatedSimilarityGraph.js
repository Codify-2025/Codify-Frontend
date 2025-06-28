import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import Text from '@components/Text';
import SimilarityGraph from '@features/Result/SimilarityGraph';
import { dummyAssignments } from '@constants/dummyAssignments';
import { accumulateSimilarityData } from '@utils/accumulateSimilarity';
const AccumulatedSimilarityGraph = () => {
    const [hoverInfo, setHoverInfo] = useState(null);
    // 누적 유사도 데이터 가공
    const { nodes, edges } = useMemo(() => {
        return accumulateSimilarityData(dummyAssignments);
    }, []);
    return (_jsxs("div", { className: "grid grid-cols-10 gap-8 items-start", children: [_jsx("div", { className: "col-span-6 bg-white p-4 rounded shadow", children: _jsx(SimilarityGraph, { nodes: nodes, edges: edges, interactionOptions: {
                        zoomView: false,
                        dragView: false,
                        dragNodes: false,
                    }, onNodeHover: (node) => {
                        const connected = edges.filter((e) => e.from === node.id || e.to === node.id);
                        const connectedNames = connected.map((e) => {
                            const otherId = e.from === node.id ? e.to : e.from;
                            return nodes.find((n) => n.id === otherId)?.label;
                        });
                        setHoverInfo([
                            `📄 학생명: ${node.label}`,
                            '',
                            ...connectedNames.map((n) => `• ${n}`),
                        ].join('\n'));
                    }, onEdgeHover: (edge) => {
                        const from = nodes.find((n) => n.id === edge.from);
                        const to = nodes.find((n) => n.id === edge.to);
                        setHoverInfo(`👥 ${from?.label} ↔ ${to?.label}\n유사도 평균: ${edge.similarity}%\n관측 횟수: ${edge.count}회`);
                    } }) }), _jsxs("div", { className: "col-span-4 bg-white p-4 rounded shadow", children: [_jsx(Text, { variant: "body", weight: "bold", className: "text-base mb-2 border-b pb-1", children: "2\uD68C \uC774\uC0C1 \uB192\uC740 \uC720\uC0AC\uB3C4\uAC00 \uAD00\uCE21\uB41C \uD559\uC0DD \uC30D" }), _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "text-gray-500 font-medium border-b", children: _jsxs("tr", { children: [_jsx("th", { children: "\uD559\uC0DD \uC30D" }), _jsx("th", { children: "\uC720\uC0AC\uB3C4" }), _jsx("th", { children: "\uAD00\uCE21 \uD69F\uC218" })] }) }), _jsx("tbody", { children: edges
                                    .filter((e) => e.count >= 2)
                                    .map((e) => {
                                    const from = nodes.find((n) => n.id === e.from);
                                    const to = nodes.find((n) => n.id === e.to);
                                    return (_jsxs("tr", { className: "border-b", children: [_jsxs("td", { children: [from?.label, " \u2194 ", to?.label] }), _jsxs("td", { className: "text-red-600 font-medium", children: [e.similarity, "%"] }), _jsxs("td", { className: "text-blue-500", children: [e.count, "\uD68C"] })] }, `${e.from}-${e.to}`));
                                }) })] }), hoverInfo && (_jsx("div", { className: "mt-4 p-3 border border-gray-200 rounded bg-gray-50 text-sm whitespace-pre-line text-gray-700", children: hoverInfo }))] })] }));
};
export default AccumulatedSimilarityGraph;
