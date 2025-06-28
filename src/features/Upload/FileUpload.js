import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import JSZip from 'jszip';
import FileItem from './FileItem';
import Button from '@components/Button';
import Notification from '@components/Notification';
import FileCompareModal from './FileCompareModal';
const SUPPORTED_EXTENSIONS = ['.cpp', '.zip'];
const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [notification, setNotification] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [duplicateFile, setDuplicateFile] = useState(null);
    const [existingFile, setExistingFile] = useState(null);
    const fileInputRef = useRef(null);
    // 파일 선택 이벤트
    const handleFileSelect = (e) => {
        const newFiles = Array.from(e.target.files || []);
        handleFileProcessing(newFiles);
    };
    // 드래그 앤 드롭 이벤트
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newFiles = Array.from(e.dataTransfer.files);
        handleFileProcessing(newFiles);
    };
    // 파일 처리 함수
    const handleFileProcessing = async (newFiles) => {
        for (const file of newFiles) {
            const extension = file.name
                .slice(file.name.lastIndexOf('.'))
                .toLowerCase();
            if (!SUPPORTED_EXTENSIONS.includes(extension)) {
                setNotification('지원하지 않는 파일 형식입니다.');
                setTimeout(() => setNotification(null), 3000);
                continue;
            }
            if (extension === '.zip') {
                const isValidZip = await validateZipFile(file);
                if (!isValidZip) {
                    setNotification('지원하지 않는 파일 형식이 포함되어 있습니다.');
                    setTimeout(() => setNotification(null), 3000);
                    continue;
                }
            }
            const existing = files.find((f) => f.file.name === file.name);
            if (existing) {
                setDuplicateFile(file);
                setExistingFile(existing.file);
                return;
            }
            addFile(file);
        }
    };
    // .zip 파일 내부 검사 함수
    const validateZipFile = async (file) => {
        try {
            const zip = new JSZip();
            const content = await zip.loadAsync(file);
            const entries = Object.keys(content.files);
            for (const entry of entries) {
                const extension = entry.slice(entry.lastIndexOf('.')).toLowerCase();
                if (extension !== '.cpp')
                    return false;
            }
            return true;
        }
        catch (error) {
            console.error('ZIP 파일 분석 에러:', error);
            return false;
        }
    };
    // 파일 추가 함수
    const addFile = (file) => {
        const newFile = {
            id: `${file.name}-${Date.now()}`,
            file,
            status: 'uploading',
        };
        setFiles((prev) => [...prev, newFile]);
        setTimeout(() => {
            setFiles((prev) => prev.map((f) => (f.id === newFile.id ? { ...f, status: 'success' } : f)));
        }, 3000);
    };
    // 체크박스 선택/해제
    const handleSelectFile = (id) => {
        setSelectedFiles((prev) => prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]);
    };
    // 전체 선택/해제
    const handleSelectAll = () => {
        if (selectedFiles.length === files.length) {
            setSelectedFiles([]);
        }
        else {
            setSelectedFiles(files.map((file) => file.id));
        }
    };
    // 선택된 파일 삭제
    const handleDeleteSelected = () => {
        setFiles((prev) => prev.filter((file) => !selectedFiles.includes(file.id)));
        setSelectedFiles([]);
    };
    // 모달에서 파일 선택 시
    const handleFileSelection = (selectedFile) => {
        if (selectedFile === duplicateFile) {
            // 새 파일 업로드 선택 시, 기존 파일 삭제 후 새 파일 추가
            if (existingFile) {
                setFiles((prev) => prev.filter((f) => f.file.name !== existingFile.name));
                addFile(duplicateFile);
            }
        }
        setDuplicateFile(null);
        setExistingFile(null);
    };
    // 모달 취소 시
    const handleModalCancel = () => {
        setDuplicateFile(null);
        setExistingFile(null);
    };
    return (_jsxs("div", { className: "flex gap-6 px-4 py-8 w-full max-w-screen-lg mx-auto", children: [duplicateFile && existingFile && (_jsx(FileCompareModal, { existingFile: existingFile, newFile: duplicateFile, onSelect: handleFileSelection, onCancel: handleModalCancel })), _jsxs("div", { className: "flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 cursor-pointer aspect-square\n                w-1/2 md:w-2/5 lg:w-1/3", onDragOver: handleDragOver, onDrop: handleDrop, onClick: () => fileInputRef.current?.click(), children: [_jsxs("p", { className: "text-gray-500 text-center", children: ["\uC774\uACF3\uC5D0 \uD30C\uC77C\uC744 \uB4DC\uB798\uADF8\uD558\uAC70\uB098 ", _jsx("br", {}), "\uD074\uB9AD\uD558\uC5EC \uC5C5\uB85C\uB4DC\uD558\uC138\uC694"] }), _jsx("input", { type: "file", multiple: true, ref: fileInputRef, className: "hidden", onChange: handleFileSelect, accept: ".cpp,.zip" })] }), _jsxs("div", { className: "flex flex-col w-1/2 md:w-3/5 lg:w-2/3 space-y-4", children: [notification && _jsx(Notification, { message: notification, type: "warning" }), _jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsxs("div", { children: [_jsx("input", { type: "checkbox", checked: selectedFiles.length === files.length && files.length > 0, onChange: handleSelectAll, className: "mr-2" }), "\uC804\uCCB4 \uC120\uD0DD"] }), _jsx(Button, { text: "\uC120\uD0DD\uB41C \uD30C\uC77C \uC0AD\uC81C", variant: "danger", className: "px-2 py-1 text-sm", onClick: handleDeleteSelected, disabled: selectedFiles.length === 0 })] }), _jsx("div", { className: "overflow-y-auto max-h-[300px] bg-gray-50 p-4 rounded-lg shadow-inner space-y-2", children: files.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "\uC5C5\uB85C\uB4DC\uB41C \uD30C\uC77C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) : (files.map((fileData) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: selectedFiles.includes(fileData.id), onChange: () => handleSelectFile(fileData.id) }), _jsx(FileItem, { fileData: fileData, onRemove: () => setFiles((prev) => prev.filter((f) => f.id !== fileData.id)) })] }, fileData.id)))) })] })] }));
};
export default FileUpload;
