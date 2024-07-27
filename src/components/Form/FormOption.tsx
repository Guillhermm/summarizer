import React, { Dispatch, SetStateAction, useState } from 'react';
import { validateEmptyField } from '../../utils/formValidation';

export interface FormOptionProps {
  customAsyncValidation?: (value: string) => Promise<string | undefined>;
  customValidation?: (value: string) => string | undefined;
  handleChange?: (value: string) => void;
  isRequired?: boolean;
  label: string;
  min?: number;
  placeholder?: string;
  setFormHasErrors?: Dispatch<SetStateAction<boolean>>;
  text?: string;
  textHelper?: string;
  type: React.HTMLInputTypeAttribute;
  value?: string | number | readonly string[];
}

export const FormOption = ({
  customAsyncValidation,
  customValidation,
  handleChange,
  isRequired = false,
  label,
  min,
  placeholder,
  setFormHasErrors,
  text,
  textHelper,
  type,
  value,
}: FormOptionProps) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;
    let error: string | undefined;

    if (isRequired) {
      error = validateEmptyField(value);
    }

    if (customAsyncValidation) {
      error = await customAsyncValidation(value);
    }

    if (customValidation) {
      error = customValidation(value);
    }

    if (setFormHasErrors) {
      setFormHasErrors(Boolean(error));
    }

    setError(error);
  };

  return (
    <div className="tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-1">
      <label className="tw-summarizer-font-bold">
        {label} {isRequired && <span className="tw-summarizer-text-red-500">*</span>}
      </label>
      {text && <p className="tw-summarizer-text-gray-500">{text}</p>}
      <input
        type={type}
        value={value}
        min={min}
        onChange={handleChange ? (e) => handleChange(e.target.value) : undefined}
        onBlur={handleBlur}
        placeholder={placeholder ?? label}
        className="tw-summarizer-border tw-summarizer-p-1 tw-summarizer-w-full"
      />
      {textHelper && (
        <p className="tw-summarizer-text-gray-900 tw-summarizer-text-sm tw-summarizer-font-medium">
          {textHelper}
        </p>
      )}
      {error && (
        <p className="tw-summarizer-text-red-500 tw-summarizer-text-sm tw-summarizer-font-medium">
          {error}
        </p>
      )}
    </div>
  );
};
