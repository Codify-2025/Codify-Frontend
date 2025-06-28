import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
const STATUS_COLORS = {
    uploading: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
};
const FileItem = ({ fileData, onRemove }) => {
    const { file, status } = fileData;
    const [progress, setProgress] = useState(0);
    /**
     * 로딩바 진행 로직
     */
    useEffect(() => {
        if (status === 'uploading') {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    const nextProgress = prev + 10;
                    return nextProgress >= 100 ? 100 : nextProgress;
                });
            }, 200);
            return () => clearInterval(interval);
        }
        if (status === 'success' || status === 'error') {
            setProgress(100);
        }
    }, [status]);
    return (_jsxs("div", { className: "flex items-center bg-gray-100 p-2 rounded-lg shadow-sm w-full max-w-lg mb-2", children: [_jsx("div", { className: "w-[50%] truncate pr-2", title: file.name, children: file.name }), _jsx("div", { className: "relative h-2 bg-gray-300 rounded-lg overflow-hidden w-[30%] mr-2", children: _jsx("div", { className: `absolute top-0 left-0 h-full ${STATUS_COLORS[status]}`, style: { width: `${progress}%`, transition: 'width 0.3s ease' } }) }), _jsx("div", { className: "w-[20%] flex justify-center items-center", children: _jsx("span", { className: "text-sm", children: status === 'uploading' ? `${progress}%` : status }) }), _jsx("button", { onClick: onRemove, className: "ml-2", children: _jsx(FiTrash2, { className: "text-red-500" }) })] }));
};
export default FileItem;
