import React from 'react';
import '../styles/tailwind.css';

export interface FormProps {
  handleChange?: any;
  label: string;
  placeholder?: string;
  text?: string;
  type: React.HTMLInputTypeAttribute;
  value?: string | number | readonly string[];
}

export const FormOption = ({ label, handleChange, placeholder, text, type, value }: FormProps) => (
  <div className="flex flex-col gap-1">
    <label className="font-bold">{label}</label>
    {text && <p>{text}</p>}
    <input
      type={type}
      value={value}
      onChange={handleChange ? (e) => handleChange(e.target.value) : undefined}
      className="border p-1 w-full"
      placeholder={placeholder ?? label}
    />
  </div>
);
