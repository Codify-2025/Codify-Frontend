import React from 'react';
import classNames from 'classnames';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

const TYPE_CLASSES = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-black',
  info: 'bg-blue-500 text-white',
};

const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  className = '',
}) => {
  return (
    <div
      className={classNames(
        'p-4 rounded-lg mb-4',
        TYPE_CLASSES[type],
        className
      )}
    >
      {message}
    </div>
  );
};

export default Notification;
