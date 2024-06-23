import { configs } from '../configs';
import { getOpenAIResponse } from '../services/openaiService';

export const validateApiKey = async (value: string) => {
  const content = 'This is just a test to validate API key.';
  const response = await getOpenAIResponse({ content, apiKey: value });

  if (response?.hasError) {
    return 'API Key is invalid';
  }

  return undefined;
};

export const validateEmptyField = (value: string) =>
  value ? undefined : configs.form.validation.empty;

export const validateMinValue = (value: string, min: number) =>
  Number(value) >= min ? undefined : `${configs.form.validation.minNumber} ${min}`;
