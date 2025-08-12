import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

interface FileData {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  studentId?: string;
  studentName?: string;
  submittedAt?: Date;
  isFromZip?: boolean;
}

interface FileItemProps {
  fileData: FileData;
  onRemove: () => void;
  externalStage?:
    | 'idle'
    | 'presigning'
    | 'uploading'
    | 'registering'
    | 'done'
    | 'error';
  externalProgress?: number;
}

const STATUS_COLORS = {
  uploading: 'bg-blue-500',
  success: 'bg-green-500',
  error: 'bg-red-500',
};

const formatDate = (date?: Date): string => {
  if (!date) return '';
  return `${date.getFullYear()}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const FileItem: React.FC<FileItemProps> = ({
  fileData,
  onRemove,
  externalStage,
  externalProgress,
}) => {
  const {
    file,
    status: localStatus,
    studentId,
    studentName,
    submittedAt,
    isFromZip,
  } = fileData;

  const mappedStatus: 'uploading' | 'success' | 'error' = externalStage
    ? externalStage === 'done'
      ? 'success'
      : externalStage === 'error'
        ? 'error'
        : 'uploading'
    : localStatus;

  const progress = externalProgress ?? (mappedStatus === 'uploading' ? 0 : 100);

  return (
    <div className="flex flex-col bg-gray-100 p-3 rounded-lg shadow-sm w-full max-w-lg mb-2">
      {/* 상단 영역: 파일명, 상태, 삭제 */}
      <div className="flex items-center justify-between w-full">
        {/* 파일명 + 압축 표시 */}
        <div
          className="w-[50%] truncate pr-2 text-sm font-medium flex items-center gap-2"
          title={file.name}
        >
          <span>{file.name}</span>
          {isFromZip && (
            <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
              압축파일
            </span>
          )}
        </div>

        {/* 로딩바 + 상태 */}
        <div className="flex items-center w-[40%] justify-end">
          <div className="relative h-2 bg-gray-300 rounded-lg overflow-hidden w-[70%] mr-2">
            <div
              className={`absolute top-0 left-0 h-full ${STATUS_COLORS[mappedStatus]}`}
              style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
            />
          </div>
          <span className="text-xs text-gray-600 w-[30%] text-right">
            {mappedStatus === 'uploading' ? `${progress}%` : mappedStatus}
          </span>
        </div>

        {/* 삭제 버튼 */}
        <button onClick={onRemove} className="ml-2">
          <FiTrash2 className="text-red-500" />
        </button>
      </div>

      {/* 하단 영역: 학번, 이름, 제출일자 */}
      <div className="mt-2 text-xs text-gray-500 space-y-1 pl-1">
        <p>
          제출자: {studentId} / {studentName}
        </p>
        <p>제출일: {formatDate(submittedAt)}</p>
      </div>
    </div>
  );
};

export default FileItem;
