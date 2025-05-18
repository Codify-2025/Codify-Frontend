import React, { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

interface FileData {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
}

interface FileItemProps {
  fileData: FileData;
  onRemove: () => void;
}

const STATUS_COLORS = {
  uploading: 'bg-blue-500',
  success: 'bg-green-500',
  error: 'bg-red-500',
};

const FileItem: React.FC<FileItemProps> = ({ fileData, onRemove }) => {
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

  return (
    <div className="flex items-center bg-gray-100 p-2 rounded-lg shadow-sm w-full max-w-lg mb-2">
      {/* 파일명 */}
      <div className="w-[50%] truncate pr-2" title={file.name}>
        {file.name}
      </div>

      {/* 로딩바 */}
      <div className="relative h-2 bg-gray-300 rounded-lg overflow-hidden w-[30%] mr-2">
        <div
          className={`absolute top-0 left-0 h-full ${STATUS_COLORS[status]}`}
          style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
        />
      </div>

      {/* 상태 표시 */}
      <div className="w-[20%] flex justify-center items-center">
        <span className="text-sm">
          {status === 'uploading' ? `${progress}%` : status}
        </span>
      </div>

      {/* 삭제 버튼 */}
      <button onClick={onRemove} className="ml-2">
        <FiTrash2 className="text-red-500" />
      </button>
    </div>
  );
};

export default FileItem;
