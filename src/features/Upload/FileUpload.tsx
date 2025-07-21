import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import FileItem from './FileItem';
import Button from '@components/Button';
import Text from '@components/Text';
import Notification from '@components/Notification';
import FileCompareModal from './FileCompareModal';
import { FiUploadCloud } from 'react-icons/fi';

interface FileData {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  studentId?: string;
  studentName?: string;
  submittedAt?: Date;
}

const SUPPORTED_EXTENSIONS = ['.cpp', '.zip'];

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    handleFileProcessing(newFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = Array.from(e.dataTransfer.files);
    handleFileProcessing(newFiles);
  };

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
        const extracted = await extractFilesFromZip(file);

        const nonDuplicate = extracted.filter(
          (e) =>
            !files.some(
              (f) =>
                f.studentId === e.studentId && f.studentName === e.studentName
            )
        );

        if (nonDuplicate.length === 0) {
          setNotification('모든 파일이 이미 업로드되어 있습니다.');
          setTimeout(() => setNotification(null), 3000);
          continue;
        }

        setFiles((prev) => [...prev, ...nonDuplicate]);

        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              nonDuplicate.some((e) => e.id === f.id)
                ? { ...f, status: 'success' }
                : f
            )
          );
        }, 3000);
      } else {
        const isDuplicate = files.some((f) => f.file.name === file.name);
        if (isDuplicate) {
          setDuplicateFile(file);
          setExistingFile(file);
          return;
        }
        addFile(file);
      }
    }
  };

  const extractFilesFromZip = async (zipFile: File): Promise<FileData[]> => {
    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(zipFile);
      const extractedFiles: FileData[] = [];

      const cppEntries = Object.entries(content.files).filter(
        ([name, file]) => !file.dir && name.toLowerCase().endsWith('.cpp')
      );

      for (const [filename] of cppEntries) {
        const baseName = filename.substring(filename.lastIndexOf('/') + 1);
        const nameWithoutExt = baseName.replace(/\.[^/.]+$/, '');
        const [studentId, studentName] = nameWithoutExt.split('_');
        const fallback = nameWithoutExt;

        extractedFiles.push({
          id: `${zipFile.name}-${filename}-${Date.now()}`,
          file: new File([], baseName),
          status: 'uploading',
          studentId: studentId || fallback,
          studentName: studentName || fallback,
          submittedAt: new Date(zipFile.lastModified),
        });
      }

      return extractedFiles;
    } catch (error) {
      console.error('ZIP 처리 실패:', error);
      return [];
    }
  };

  const extractFileMeta = (file: File) => {
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    const [studentId, studentName] = nameWithoutExt.split('_');

    return {
      studentId: studentId || nameWithoutExt,
      studentName: studentName || nameWithoutExt,
      submittedAt: new Date(file.lastModified),
    };
  };

  const addFile = (file: File) => {
    const { studentId, studentName, submittedAt } = extractFileMeta(file);
    const newFile: FileData = {
      id: `${file.name}-${Date.now()}`,
      file,
      status: 'uploading',
      studentId,
      studentName,
      submittedAt,
    };

    setFiles((prev) => [...prev, newFile]);

    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => (f.id === newFile.id ? { ...f, status: 'success' } : f))
      );
    }, 3000);
  };

  const handleSelectFile = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedFiles(
      selectedFiles.length === files.length ? [] : files.map((f) => f.id)
    );
  };

  const handleDeleteSelected = () => {
    setFiles((prev) => prev.filter((f) => !selectedFiles.includes(f.id)));
    setSelectedFiles([]);
  };

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile === duplicateFile && existingFile) {
      setFiles((prev) => prev.filter((f) => f.file.name !== existingFile.name));
      addFile(duplicateFile);
    }
    setDuplicateFile(null);
    setExistingFile(null);
  };

  const handleModalCancel = () => {
    setDuplicateFile(null);
    setExistingFile(null);
  };

  return (
    <div className="flex gap-10 px-6 py-1 w-full max-w-screen-lg mx-auto">
      {duplicateFile && existingFile && (
        <FileCompareModal
          existingFile={existingFile}
          newFile={duplicateFile}
          onSelect={handleFileSelection}
          onCancel={handleModalCancel}
        />
      )}

      <div
        className="flex flex-col h-[350px] items-center justify-center border border-dotted border-gray rounded-xl bg-lightGray hover:bg-blue-50 transition p-6 cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <FiUploadCloud size={40} className="text-primary mb-2" />
        <p className="text-gray text-center text-base">
          이곳에 파일을 드래그하거나 <br /> 클릭하여 업로드하세요
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

      <div className="flex flex-col w-1/2 md:w-3/5 lg:w-2/3 ">
        {notification && <Notification message={notification} type="warning" />}
        <div className="flex justify-between items-center mb-3">
          <Text variant="caption" weight="medium" color="primary">
            파일 목록 ({files.length})
          </Text>
          <div className="flex gap-5 items-center">
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
        </div>
        <div className="h-0.5 bg-lightGray" />

        <div className="overflow-y-auto max-h-[300px] bg-gray-50 p-4 rounded-lg space-y-2">
          {files.length === 0 ? (
            <p className="text-gray-500">업로드된 파일이 없습니다.</p>
          ) : (
            files.map((fileData) => (
              <div
                key={fileData.id}
                className="bg-white px-4 rounded-lg shadow flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 w-full overflow-hidden">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(fileData.id)}
                    onChange={() => handleSelectFile(fileData.id)}
                  />
                  <FileItem
                    fileData={fileData}
                    onRemove={() =>
                      setFiles((prev) =>
                        prev.filter((f) => f.id !== fileData.id)
                      )
                    }
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
