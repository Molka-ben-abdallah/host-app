import React from 'react';

type InputProps = {
  label?: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

const Input: React.FC<InputProps> = ({ label, type, value, onChange, placeholder, required, className }) => {
  return (
    <div className=" px-8">
      {label && <label className="block text-gray-700 font-primaryRegular">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`font-primaryRegular justify-center w-100 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFAF20] ${className}`}
      />
    </div>
  );
};

export default Input;