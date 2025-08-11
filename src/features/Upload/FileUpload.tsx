import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import FileItem from './FileItem';
import Button from '@components/Button';
import Text from '@components/Text';
import Notification from '@components/Notification';
import FileCompareModal from './FileCompareModal';
import { FiUploadCloud } from 'react-icons/fi';
import { useUploader } from '@hooks/useUploader';
import { useAssignmentStore } from '@stores/useAssignmentStore';

interface FileData {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  studentId?: string;
  studentName?: string;
  submittedAt?: Date;
  isFromZip?: boolean;
}

const SUPPORTED_EXTENSIONS = ['.cpp', '.zip'];

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const { items, enqueue, cancel, start } = useUploader(3);

  const { assignmentId, week } = useAssignmentStore();

  // 업로드 상태/진행률 매핑 헬퍼
  const findUploaderIndex = (f: File) => items.findIndex((it) => it.file === f);
  const getStage = (f: File) => {
    const i = findUploaderIndex(f);
    return i >= 0 ? items[i].stage : undefined;
  };
  const getProgress = (f: File) => {
    const i = findUploaderIndex(f);
    return i >= 0 ? items[i].progress : 0;
  };

  const [notification, setNotification] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    void handleFileProcessing(newFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = Array.from(e.dataTransfer.files);
    void handleFileProcessing(newFiles);
  };

  const handleFileProcessing = async (newFiles: File[]) => {
    // 과제/주차 값 확인
    if (!assignmentId || !week) {
      setNotification(
        '과제/주차 정보가 없습니다. 이전 단계에서 과제를 다시 선택해 주세요.'
      );
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // 이번 add에서 추가될 파일과 메타를 한 번에 모으기
    const batchFileDatas: FileData[] = [];
    const metaMap = new Map<
      File,
      { studentId: number; studentName: string; submittedAt: Date }
    >();

    // 결과 집계용
    const invalidFiles: string[] = []; // 미지원 확장자
    const duplicateFiles: string[] = []; // 중복/이미 업로드
    const addedFiles: string[] = []; // 실제 추가된 파일명

    for (const file of newFiles) {
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

      if (!SUPPORTED_EXTENSIONS.includes(ext)) {
        invalidFiles.push(file.name);
        continue;
      }

      if (ext === '.zip') {
        const extracted = await extractFilesFromZip(file);

        // 중복 제거 (기존 목록 + 이번 배치에 이미 담긴 것 모두와 비교)
        const nonDuplicate = extracted.filter(
          (e) =>
            !files.some(
              (f) =>
                f.studentId === e.studentId &&
                f.studentName === e.studentName &&
                f.file.name === e.file.name
            ) &&
            !batchFileDatas.some(
              (f) =>
                f.studentId === e.studentId &&
                f.studentName === e.studentName &&
                f.file.name === e.file.name
            )
        );

        if (nonDuplicate.length === 0) {
          duplicateFiles.push(`${file.name} (압축 내 중복)`);
          continue;
        }

        batchFileDatas.push(...nonDuplicate);
        for (const e of nonDuplicate) {
          metaMap.set(e.file, {
            studentId: Number(e.studentId ?? 0) || 0,
            studentName: e.studentName ?? 'Unknown',
            submittedAt: e.submittedAt ?? new Date(),
          });
          addedFiles.push(e.file.name);
        }
      } else {
        // 단일 .cpp
        const { studentId, studentName, submittedAt } = extractFileMeta(file);
        const newFD: FileData = {
          id: `${file.name}-${Date.now()}`,
          file,
          status: 'uploading', // 표시용, 실제 진행은 훅 stage/progress로 반영
          studentId,
          studentName,
          submittedAt,
        };

        // 중복 검사 (기존 목록 + 이번 배치)
        const isDupInCurrent =
          files.some(
            (f) =>
              f.file.name === file.name &&
              f.studentId === newFD.studentId &&
              f.studentName === newFD.studentName
          ) ||
          batchFileDatas.some(
            (f) =>
              f.file.name === file.name &&
              f.studentId === newFD.studentId &&
              f.studentName === newFD.studentName
          );

        if (isDupInCurrent) {
          duplicateFiles.push(file.name);
          continue;
        }

        batchFileDatas.push(newFD);
        metaMap.set(file, {
          studentId: Number(studentId ?? 0) || 0,
          studentName: studentName ?? 'Unknown',
          submittedAt,
        });
        addedFiles.push(file.name);
      }
    }

    // 추가된 게 하나도 없으면, 집계 내용으로 알림을 한 번만 보여줌
    if (batchFileDatas.length === 0) {
      if (invalidFiles.length && !duplicateFiles.length) {
        setNotification(
          `지원하지 않는 파일 형식입니다: ${invalidFiles.join(', ')}`
        );
      } else if (!invalidFiles.length && duplicateFiles.length) {
        setNotification('모든 파일이 이미 업로드되어 있습니다.');
      } else if (invalidFiles.length && duplicateFiles.length) {
        setNotification(
          `모든 파일이 무시되었습니다. (중복 ${duplicateFiles.length}개, 미지원 ${invalidFiles.length}개)`
        );
      } else {
        setNotification('추가된 파일이 없습니다.');
      }
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // 로컬 목록/UI 갱신
    setFiles((prev) => [...prev, ...batchFileDatas]);

    // 훅 큐에 한 번에 넣기
    const batchFiles = batchFileDatas.map((b) => b.file);
    enqueue(batchFiles);

    // 딱 한 번 start 호출 (파일별 메타 파생)
    start((fileObj) => {
      const meta = metaMap.get(fileObj) ?? {
        studentId: 0,
        studentName: 'Unknown',
        submittedAt: new Date(),
      };
      return {
        assignmentId,
        week,
        submissionDate: meta.submittedAt,
        studentId: meta.studentId,
        studentName: meta.studentName,
      };
    });

    // 혼합 상황(일부 추가/일부 중복/일부 미지원) 안내
    if (invalidFiles.length || duplicateFiles.length) {
      const parts: string[] = [];
      if (addedFiles.length) parts.push(`${addedFiles.length}개 추가`);
      if (duplicateFiles.length)
        parts.push(`중복 ${duplicateFiles.length}개 제외`);
      if (invalidFiles.length)
        parts.push(`미지원 ${invalidFiles.length}개 제외`);
      setNotification(parts.join(' · '));
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // 삭제 시 업로드 중이면 cancel 호출
  const handleRemove = (fd: FileData) => {
    const idx = findUploaderIndex(fd.file);
    if (idx >= 0) cancel(idx);
    setFiles((prev) => prev.filter((f) => f.id !== fd.id));
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
        const underscoreIndex = nameWithoutExt.indexOf('_');
        const studentId =
          underscoreIndex !== -1
            ? nameWithoutExt.substring(0, underscoreIndex)
            : '';
        const studentName =
          underscoreIndex !== -1
            ? nameWithoutExt.substring(underscoreIndex + 1)
            : '';
        const fallback = nameWithoutExt;

        const fileBlob = await content.files[filename].async('blob');
        extractedFiles.push({
          id: `${zipFile.name}-${filename}-${Date.now()}`,
          file: new File([fileBlob], baseName, { type: 'text/plain' }),
          status: 'uploading',
          studentId: studentId || fallback,
          studentName: studentName || fallback,
          submittedAt: new Date(zipFile.lastModified),
          isFromZip: true,
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

  // 기존 모달에서 "새 파일 업로드" 선택 시 사용 (로컬 목록만 교체)
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

      {/* 드래그&드롭 / 클릭 업로드 영역 */}
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

      {/* 파일 리스트 영역 */}
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
            files.map((fd) => {
              const stage = getStage(fd.file);
              const progress = getProgress(fd.file);
              return (
                <div
                  key={fd.id}
                  className="bg-white px-4 rounded-lg shadow flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2 w-full overflow-hidden">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(fd.id)}
                      onChange={() => handleSelectFile(fd.id)}
                    />
                    <FileItem
                      fileData={fd}
                      onRemove={() => handleRemove(fd)}
                      externalStage={stage}
                      externalProgress={progress}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
