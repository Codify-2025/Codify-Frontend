import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const steps = ['약관 동의', '닉네임', '생년월일', '계정 정보'];
const ProgressBar = ({ currentStep }) => {
    return (_jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4", children: _jsx("div", { className: "h-full bg-black transition-all duration-300", style: {
                        width: `${((currentStep + 1) / steps.length) * 100}%`,
                    } }) }), _jsx("div", { className: "flex justify-between text-sm text-gray-600", children: steps.map((label, index) => (_jsx("div", { className: "flex-1 text-center", children: _jsx("span", { className: index === currentStep ? 'font-bold text-black' : '', children: label }) }, index))) })] }));
};
export default ProgressBar;
