import React, { useState } from 'react';
import { configs } from '../configs';

export interface FormProps {
  handleChange?: (value: string) => void;
  isRequired?: boolean;
  label: string;
  placeholder?: string;
  text?: string;
  type: React.HTMLInputTypeAttribute;
  value?: string | number | readonly string[];
}

export const FormOption = ({
  label,
  isRequired = false,
  handleChange,
  placeholder,
  text,
  type,
  value,
}: FormProps) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;

    if (isRequired) {
      const error = validateEmptyField(value);
      setError(error);
    }
  };

  const validateEmptyField = (value: string) =>
    value ? undefined : configs.options.validation.empty;

  return (
    <div className="tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-1">
      <label className="tw-summarizer-font-bold">
        {label} {isRequired && <span className="tw-summarizer-text-red-500">*</span>}
      </label>
      {text && <p>{text}</p>}
      <input
        type={type}
        value={value}
        onChange={handleChange ? (e) => handleChange(e.target.value) : undefined}
        onBlur={handleBlur}
        placeholder={placeholder ?? label}
        className="tw-summarizer-border tw-summarizer-p-1 tw-summarizer-w-full"
      />
      {error && (
        <p className="tw-summarizer-text-red-500 tw-summarizer-text-sm tw-summarizer-font-medium">
          {error}
        </p>
      )}
    </div>
  );
};
