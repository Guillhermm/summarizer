import React from 'react';
import '../styles/tailwind.css';

export interface FormProps {
  handleChange?: (value: string) => void;
  label: string;
  placeholder?: string;
  text?: string;
  type: React.HTMLInputTypeAttribute;
  value?: string | number | readonly string[];
}

export const FormOption = ({ label, handleChange, placeholder, text, type, value }: FormProps) => (
  <div className="tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-1">
    <label className="tw-summarizer-font-bold">{label}</label>
    {text && <p>{text}</p>}
    <input
      type={type}
      value={value}
      onChange={handleChange ? (e) => handleChange(e.target.value) : undefined}
      className="tw-summarizer-border tw-summarizer-p-1 tw-summarizer-w-full"
      placeholder={placeholder ?? label}
    />
  </div>
);
