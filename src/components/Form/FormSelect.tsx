import React from 'react';

export interface SelectOption {
  id: string;
  label: string;
}

export interface FormSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  text?: string;
}

export const FormSelect = ({ label, value, options, onChange, text }: FormSelectProps) => (
  <div className="tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-1">
    <label className="tw-summarizer-font-bold">{label}</label>
    {text && <span className="tw-summarizer-text-gray-500 tw-summarizer-text-sm">{text}</span>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="tw-summarizer-p-1.5 tw-summarizer-border tw-summarizer-w-full tw-summarizer-rounded tw-summarizer-text-sm tw-summarizer-bg-white tw-summarizer-cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
