import React from 'react';
import Button from './Button';
import Text from './Text';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <div className="w-80 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        {title && (
          <Text variant="heading" weight="bold" className="mb-4">
            {title}
          </Text>
        )}
        <div className="mb-4">{children}</div>
        <div className="text-right">
          <Button text="닫기" variant="secondary" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
