import React from 'react';
import Button from '@components/Button';

interface FileCompareModalProps {
  existingFile: File;
  newFile: File;
  onSelect: (file: File) => void;
  onCancel: () => void;
}

const FileCompareModal: React.FC<FileCompareModalProps> = ({
  existingFile,
  newFile,
  onSelect,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg min-w-[300px] space-y-6">
        <h2 className="text-xl font-bold mb-4 text-center">파일 비교</h2>

        {/* 파일 정보 영역 */}
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* 기존 파일 */}
          <div className="flex-1 bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-600 mb-2">기존 파일</h3>
            <p className="font-bold text-gray-700 truncate">
              {existingFile.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              크기: {existingFile.size} bytes
            </p>
            <p className="text-sm text-gray-500">유형: {existingFile.type}</p>
          </div>

          {/* 새 파일 */}
          <div className="flex-1 bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-green-600 mb-2">새 파일</h3>
            <p className="font-bold text-gray-700 truncate">{newFile.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              크기: {newFile.size} bytes
            </p>
            <p className="text-sm text-gray-500">유형: {newFile.type}</p>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
          <Button
            text="기존 파일 유지"
            variant="secondary"
            onClick={() => onSelect(existingFile)}
          />
          <Button
            text="새 파일 업로드"
            variant="primary"
            onClick={() => onSelect(newFile)}
          />
          <Button text="취소" variant="danger" onClick={onCancel} />
        </div>
      </div>
    </div>
  );
};

export default FileCompareModal;
