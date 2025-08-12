// FileUpload.tsx
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
type Meta = { studentId: number; studentName: string; submittedAt: Date };

const SUPPORTED_EXTENSIONS = ['.cpp', '.zip'];

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const { items, enqueue, cancel, start } = useUploader(3);
  const { assignmentId, week } = useAssignmentStore();

  const [notification, setNotification] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 업로드 상태/진행률 매핑
  const findUploaderIndex = (f: File) => items.findIndex((it) => it.file === f);
  const getStage = (f: File) =>
    findUploaderIndex(f) >= 0 ? items[findUploaderIndex(f)].stage : undefined;
  const getProgress = (f: File) =>
    findUploaderIndex(f) >= 0 ? items[findUploaderIndex(f)].progress : 0;

  const showTimedNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const validateAssignmentContext = () => {
    if (!assignmentId || !week) {
      showTimedNotification(
        '과제/주차 정보가 없습니다. 이전 단계에서 과제를 다시 선택해 주세요.'
      );
      return false;
    }
    return true;
  };

  const isSupported = (file: File) => {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    return SUPPORTED_EXTENSIONS.includes(ext);
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

  const extractFilesFromZip = async (zipFile: File): Promise<FileData[]> => {
    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(zipFile);
      const extractedFiles: FileData[] = [];

      const cppEntries = Object.entries(content.files).filter(
        ([, f]) => !f.dir && f.name.toLowerCase().endsWith('.cpp')
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
    } catch (e) {
      console.error('ZIP 처리 실패:', e);
      return [];
    }
  };

  const showBatchNotification = (
    invalid: string[],
    duplicate: string[],
    added: string[]
  ) => {
    if (added.length === 0) {
      if (invalid.length && !duplicate.length) {
        showTimedNotification(
          `지원하지 않는 파일 형식입니다: ${invalid.join(', ')}`
        );
      } else if (!invalid.length && duplicate.length) {
        showTimedNotification('모든 파일이 이미 업로드되어 있습니다.');
      } else if (invalid.length && duplicate.length) {
        showTimedNotification(
          `모든 파일이 무시되었습니다. (중복 ${duplicate.length}개, 미지원 ${invalid.length}개)`
        );
      } else {
        showTimedNotification('추가된 파일이 없습니다.');
      }
      return;
    }

    // 일부만 추가된 혼합 케이스
    const parts: string[] = [];
    if (added.length) parts.push(`${added.length}개 추가`);
    if (duplicate.length) parts.push(`중복 ${duplicate.length}개 제외`);
    if (invalid.length) parts.push(`미지원 ${invalid.length}개 제외`);
    if (parts.length) showTimedNotification(parts.join(' · '));
  };

  const processSingleFile = (
    file: File,
    batch: FileData[],
    metaMap: Map<File, Meta>,
    results: { invalid: string[]; duplicate: string[]; added: string[] }
  ) => {
    // 미지원 확장자
    if (!isSupported(file)) {
      results.invalid.push(file.name);
      return;
    }

    // .cpp만 들어오도록
    if (!file.name.toLowerCase().endsWith('.cpp')) {
      results.invalid.push(file.name);
      return;
    }

    const { studentId, studentName, submittedAt } = extractFileMeta(file);
    const newFD: FileData = {
      id: `${file.name}-${Date.now()}`,
      file,
      status: 'uploading',
      studentId,
      studentName,
      submittedAt,
    };

    // 중복 검사 (기존 목록 + 이번 배치)
    const isDup =
      files.some(
        (f) =>
          f.file.name === file.name &&
          f.studentId === newFD.studentId &&
          f.studentName === newFD.studentName
      ) ||
      batch.some(
        (f) =>
          f.file.name === file.name &&
          f.studentId === newFD.studentId &&
          f.studentName === newFD.studentName
      );

    if (isDup) {
      results.duplicate.push(file.name);
      // 모달 트리거
      setDuplicateFile(file);
      setExistingFile(file);
      return;
    }

    batch.push(newFD);
    metaMap.set(file, {
      studentId: Number(studentId ?? 0) || 0,
      studentName: studentName ?? 'Unknown',
      submittedAt,
    });
    results.added.push(file.name);
  };

  const processZipFile = async (
    zipFile: File,
    batch: FileData[],
    metaMap: Map<File, Meta>,
    results: { invalid: string[]; duplicate: string[]; added: string[] }
  ) => {
    if (!isSupported(zipFile)) {
      results.invalid.push(zipFile.name);
      return;
    }
    if (!zipFile.name.toLowerCase().endsWith('.zip')) {
      results.invalid.push(zipFile.name);
      return;
    }

    const extracted = await extractFilesFromZip(zipFile);

    const nonDuplicate = extracted.filter(
      (e) =>
        !files.some(
          (f) =>
            f.studentId === e.studentId &&
            f.studentName === e.studentName &&
            f.file.name === e.file.name
        ) &&
        !batch.some(
          (f) =>
            f.studentId === e.studentId &&
            f.studentName === e.studentName &&
            f.file.name === e.file.name
        )
    );

    if (nonDuplicate.length === 0) {
      results.duplicate.push(`${zipFile.name} (압축 내 중복)`);
      return;
    }

    batch.push(...nonDuplicate);
    for (const e of nonDuplicate) {
      metaMap.set(e.file, {
        studentId: Number.isNaN(Number(e.studentId)) ? 0 : Number(e.studentId),
        studentName: e.studentName ?? 'Unknown',
        submittedAt: e.submittedAt ?? new Date(),
      });
      results.added.push(e.file.name);
    }
  };

  // 메인 핸들러
  const handleFileProcessing = async (newFiles: File[]) => {
    // 런타임 가드
    if (assignmentId == null || week == null) {
      setNotification(
        '과제/주차 정보가 없습니다. 이전 단계에서 과제를 다시 선택해 주세요.'
      );
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // null 아님이 보장된 number를 로컬 상수로 캡처
    const aId: number = assignmentId;
    const wk: number = week;

    if (!validateAssignmentContext()) return;

    const batchFileDatas: FileData[] = [];
    const metaMap = new Map<File, Meta>();
    const results = {
      invalid: [] as string[],
      duplicate: [] as string[],
      added: [] as string[],
    };

    for (const file of newFiles) {
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (ext === '.zip') {
        await processZipFile(file, batchFileDatas, metaMap, results);
      } else {
        processSingleFile(file, batchFileDatas, metaMap, results);
      }
    }

    // 결과 처리
    if (batchFileDatas.length === 0) {
      showBatchNotification(results.invalid, results.duplicate, results.added);
      return;
    }

    setFiles((prev) => [...prev, ...batchFileDatas]);

    const batchFiles = batchFileDatas.map((b) => b.file);
    enqueue(batchFiles);

    start((fileObj: File) => {
      const meta = metaMap.get(fileObj) ?? {
        studentId: 0,
        studentName: 'Unknown',
        submittedAt: new Date(),
      };
      return {
        assignmentId: aId,
        week: wk,
        submissionDate: meta.submittedAt,
        studentId: meta.studentId,
        studentName: meta.studentName,
      };
    });

    // 혼합 상황 요약 알림
    if (results.invalid.length || results.duplicate.length) {
      showBatchNotification(results.invalid, results.duplicate, results.added);
    }
  };

  // 기타 UI 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    void handleFileProcessing(newFiles);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = Array.from(e.dataTransfer.files);
    void handleFileProcessing(newFiles);
  };
  const handleRemove = (fd: FileData) => {
    const idx = findUploaderIndex(fd.file);
    if (idx >= 0) cancel(idx);
    setFiles((prev) => prev.filter((f) => f.id !== fd.id));
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
  };
  const handleSelectFile = (id: string) =>
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  const handleSelectAll = () =>
    setSelectedFiles((prev) =>
      prev.length === files.length ? [] : files.map((f) => f.id)
    );
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
        </div>
        <div className="h-0.5 bg-lightGray" />
        <div className="flex justify-end my-2">
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
