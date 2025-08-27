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

const STATUS_COLORS: Record<'uploading' | 'success' | 'error', string> = {
  uploading: 'bg-blue-500',
  success: 'bg-green-500',
  error: 'bg-red-500',
};

const formatDate = (date?: Date): string => {
  if (!date) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
    <div className="flex w-full items-start justify-between gap-2">
      {/* 좌측: 파일명/태그 + 메타 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          <span className="truncate" title={file.name}>
            {file.name}
          </span>
          {isFromZip && (
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700">
              ZIP
            </span>
          )}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          제출자: {studentId} / {studentName} · 제출일:{' '}
          {formatDate(submittedAt)}
        </div>
      </div>

      {/* 우측: 진행바/상태 + 삭제 */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="relative h-2 w-28 overflow-hidden rounded bg-gray-200">
          <div
            className={`absolute left-0 top-0 h-full ${STATUS_COLORS[mappedStatus]}`}
            style={{ width: `${progress}%`, transition: 'width .3s ease' }}
          />
        </div>
        <span className="w-14 text-right text-xs text-gray-600">
          {mappedStatus === 'uploading' ? `${progress}%` : mappedStatus}
        </span>

        <button
          onClick={onRemove}
          aria-label="파일 삭제"
          className="rounded p-1 hover:bg-red-50"
        >
          <FiTrash2 className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default FileItem;
