import React, { Dispatch, SetStateAction, useState } from 'react';
import { FormValidationProps, validateEmptyField } from '../../utils/formValidation';

export interface FormOptionProps {
  customAsyncValidation?: (value: string) => Promise<FormValidationProps>;
  customValidation?: (value: string) => FormValidationProps;
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
  const [validations, setValidations] = useState<FormValidationProps[]>([]);

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;
    const v: FormValidationProps[] = [];

    if (isRequired) {
      const validation = validateEmptyField(value);
      v.push(validation);
    }

    // For empty values in required fields, required validation should be enough so
    // we don't need to run additional validation.
    // But... if field not required, custom validation is all that's left.
    if (value || !isRequired) {
      if (customAsyncValidation) {
        const validation = await customAsyncValidation(value);
        v.push(validation);
      }

      if (customValidation) {
        const validation = customValidation(value);
        v.push(validation);
      }
    }

    setValidations(v);

    if (setFormHasErrors) {
      // Gets only failed validations to inform form.
      const errors = v.filter((validation) => validation.error);
      setFormHasErrors(errors.length > 0);
    }
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
      {validations &&
        validations.map(
          ({ error, message }, idx) =>
            message && (
              <p
                className={`tw-summarizer-text-sm tw-summarizer-font-medium ${error ? 'tw-summarizer-text-red-500' : 'tw-summarizer-text-green-700'}`}
                key={idx}
              >
                {message}
              </p>
            )
        )}
    </div>
  );
};
