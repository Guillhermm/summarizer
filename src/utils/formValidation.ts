import { configs } from '../configs';
import { getOpenAIResponse } from '../services/openaiService';

export type FormValidationProps = {
  error: boolean;
  message?: string;
};

export const validateApiKey = async (value: string): Promise<FormValidationProps> => {
  const validation: FormValidationProps = {
    error: false,
    message: configs.form.validation.apiValid,
  };

  const content = 'This is just a test to validate API key.';
  const response = await getOpenAIResponse({ content, apiKey: value });

  if (response?.hasError) {
    validation.error = true;
    validation.message = configs.form.validation.apiInvalid;
  }

  return validation;
};

export const validateEmptyField = (value: string): FormValidationProps =>
  value ? { error: false } : { error: true, message: configs.form.validation.empty };

export const validateMinValue = (value: string, min: number): FormValidationProps =>
  Number(value) >= min ? { error: false } : { error: true, message: `${configs.form.validation.minNumber} ${min}` };
