import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import FileItem from './FileItem';
import Button from '@components/Button';
import Notification from '@components/Notification';
import FileCompareModal from './FileCompareModal';

interface FileData {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
}

const SUPPORTED_EXTENSIONS = ['.cpp', '.zip'];

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 파일 선택 이벤트
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    handleFileProcessing(newFiles);
  };

  // 드래그 앤 드롭 이벤트
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = Array.from(e.dataTransfer.files);
    handleFileProcessing(newFiles);
  };

  // 파일 처리 함수
  const handleFileProcessing = async (newFiles: File[]) => {
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
  const validateZipFile = async (file: File): Promise<boolean> => {
    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      const entries = Object.keys(content.files);

      for (const entry of entries) {
        const extension = entry.slice(entry.lastIndexOf('.')).toLowerCase();
        if (extension !== '.cpp') return false;
      }

      return true;
    } catch (error) {
      console.error('ZIP 파일 분석 에러:', error);
      return false;
    }
  };

  // 파일 추가 함수
  const addFile = (file: File) => {
    const newFile: FileData = {
      id: `${file.name}-${Date.now()}`,
      file,
      status: 'uploading',
    };

    setFiles((prev) => [...prev, newFile]);

    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => (f.id === newFile.id ? { ...f, status: 'success' } : f))
      );
    }, 3000);
  };

  // 체크박스 선택/해제
  const handleSelectFile = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]
    );
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((file) => file.id));
    }
  };

  // 선택된 파일 삭제
  const handleDeleteSelected = () => {
    setFiles((prev) => prev.filter((file) => !selectedFiles.includes(file.id)));
    setSelectedFiles([]);
  };

  // 모달에서 파일 선택 시
  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile === duplicateFile) {
      // 새 파일 업로드 선택 시, 기존 파일 삭제 후 새 파일 추가
      if (existingFile) {
        setFiles((prev) =>
          prev.filter((f) => f.file.name !== existingFile.name)
        );
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

  return (
    <div className="flex gap-6 px-4 py-8 w-full max-w-screen-lg mx-auto">
      {duplicateFile && existingFile && (
        <FileCompareModal
          existingFile={existingFile}
          newFile={duplicateFile}
          onSelect={handleFileSelection}
          onCancel={handleModalCancel}
        />
      )}

      {/* 파일 업로드 영역 */}
      <div
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 cursor-pointer aspect-square
                w-1/2 md:w-2/5 lg:w-1/3"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="text-gray-500 text-center">
          이곳에 파일을 드래그하거나 <br />
          클릭하여 업로드하세요
        </p>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
          accept=".cpp,.zip"
        />
      </div>

      {/* 파일 목록 영역 */}
      <div className="flex flex-col w-1/2 md:w-3/5 lg:w-2/3 space-y-4">
        {notification && <Notification message={notification} type="warning" />}

        <div className="flex justify-between items-center mb-2">
          <div>
            <input
              type="checkbox"
              checked={
                selectedFiles.length === files.length && files.length > 0
              }
              onChange={handleSelectAll}
              className="mr-2"
            />
            전체 선택
          </div>
          <Button
            text="선택된 파일 삭제"
            variant="danger"
            className="px-2 py-1 text-sm"
            onClick={handleDeleteSelected}
            disabled={selectedFiles.length === 0}
          />
        </div>

        <div className="overflow-y-auto max-h-[300px] bg-gray-50 p-4 rounded-lg shadow-inner space-y-2">
          {files.length === 0 ? (
            <p className="text-gray-500">업로드된 파일이 없습니다.</p>
          ) : (
            files.map((fileData) => (
              <div key={fileData.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(fileData.id)}
                  onChange={() => handleSelectFile(fileData.id)}
                />
                <FileItem
                  fileData={fileData}
                  onRemove={() =>
                    setFiles((prev) => prev.filter((f) => f.id !== fileData.id))
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
