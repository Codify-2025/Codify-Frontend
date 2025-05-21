import React from 'react';
import classNames from 'classnames';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center cursor-pointer space-x-3">
      {label && (
        <span className="text-gray-700 text-sm font-medium">{label}</span>
      )}
      <div
        className={classNames(
          'w-10 h-6 flex items-center rounded-full p-1 transition-colors',
          checked ? 'bg-blue-500' : 'bg-gray'
        )}
        onClick={onChange}
      >
        <div
          className={classNames(
            'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </div>
    </label>
  );
};

export default Toggle;
