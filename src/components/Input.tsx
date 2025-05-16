import React from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'password' | 'email';
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
}) => {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 text-gray-700">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
