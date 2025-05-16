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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
        {title && (
          <Text variant="heading" weight="bold" color="gray" className="mb-4">
            {title}
          </Text>
        )}
        <div className="mb-4">{children}</div>
        <Button text="닫기" variant="secondary" onClick={onClose} />
      </div>
    </div>
  );
};

export default Modal;
