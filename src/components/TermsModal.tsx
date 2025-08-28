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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
        <Text variant="h3" weight="bold" className="mb-3">
          {title}
        </Text>
        <div className="max-h-72 overflow-y-auto whitespace-pre-line rounded-lg bg-gray-50 p-4 text-sm text-gray-700 ring-1 ring-gray-100">
          {content}
        </div>
        <div className="mt-5 flex justify-end">
          <Button text="닫기" variant="secondary" size="md" onClick={onClose} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TermsModal;
