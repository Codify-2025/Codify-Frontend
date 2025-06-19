import React from 'react';
import Button from '@components/Button';

interface Props {
  value: string;
  onChange: (newVal: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const BirthdateEditModal: React.FC<Props> = ({
  value,
  onChange,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-4">생년월일 수정</h2>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
        <div className="flex justify-end space-x-2">
          <Button
            text="취소"
            variant="secondary"
            size="small"
            onClick={onClose}
          />
          <Button text="저장" variant="primary" size="small" onClick={onSave} />
        </div>
      </div>
    </div>
  );
};

export default BirthdateEditModal;
