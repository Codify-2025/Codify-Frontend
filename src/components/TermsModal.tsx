import React from 'react';
import { createPortal } from 'react-dom';
import Text from '@components/Text';
import Button from '@components/Button';

interface TermsModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ title, content, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-6">
        <Text variant="heading" weight="bold" className="text-xl">
          {title}
        </Text>
        <div className="text-sm text-gray-700 max-h-60 overflow-y-auto whitespace-pre-line">
          {content}
        </div>
        <div className="flex justify-end">
          <Button text="닫기" onClick={onClose} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TermsModal;
