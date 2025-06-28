import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
const COLORS = ['#60A5FA', '#F87171']; // 기준 이하: 파랑, 초과: 빨강
const SimilarityPieChart = ({ passedCount, failedCount, onHover, }) => {
    const data = [
        { name: '기준 이하', value: failedCount },
        { name: '기준 초과', value: passedCount },
    ];
    const handleMouseEnter = (data) => {
        if (onHover)
            onHover(data.name);
    };
    return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: "1\uCC28 \uD544\uD130\uB9C1 \uACB0\uACFC" }), _jsxs("p", { className: "text-base text-gray-700 mb-5 text-center leading-relaxed", children: ["\uC124\uC815\uB41C \uC720\uC0AC\uB3C4 \uC784\uACC4\uAC12\uC744 \uAE30\uC900\uC73C\uB85C \uC0AC\uC804 \uD544\uD130\uB9C1\uB41C \uACB0\uACFC\uC785\uB2C8\uB2E4. ", _jsx("br", {}), "\uAE30\uC900 \uCD08\uACFC \uD30C\uC77C ", passedCount, "\uAC1C, \uAE30\uC900 \uC774\uD558 \uD30C\uC77C ", failedCount, "\uAC1C\uC758 \uBE44\uC728\uC744 \uD655\uC778\uD558\uC138\uC694."] }), _jsxs(PieChart, { width: 300, height: 300, children: [_jsx(Pie, { data: data, cx: "50%", cy: "50%", outerRadius: 110, dataKey: "value", onMouseEnter: handleMouseEnter, label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: data.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length], stroke: "#ffffff", strokeWidth: 2 }, index))) }), _jsx(Tooltip, {})] })] }));
};
export default SimilarityPieChart;
