import { configs } from '../configs';
import { ProviderId } from '../types/providers';

export type FormValidationProps = {
  error: boolean;
  message?: string;
};

// Key format validation by provider — no network call, no cost, actually provider-aware.
const KEY_PATTERNS: Partial<Record<ProviderId, { prefix: string; minLength: number }>> = {
  openai: { prefix: 'sk-', minLength: 40 },
  claude: { prefix: 'sk-ant-', minLength: 40 },
  gemini: { prefix: 'AIza', minLength: 30 },
  deepseek: { prefix: 'sk-', minLength: 30 },
};

export const validateApiKey = (
  value: string,
  provider: ProviderId = 'openai'
): FormValidationProps => {
  if (!value) {
    return { error: false }; // Empty is allowed (key is optional fallback).
  }

  const pattern = KEY_PATTERNS[provider];
  if (!pattern) {
    // chrome-ai has no key — always valid.
    return { error: false };
  }

  const isValid = value.startsWith(pattern.prefix) && value.trim().length >= pattern.minLength;

  return isValid
    ? { error: false, message: configs.form.validation.apiValid }
    : { error: true, message: configs.form.validation.apiInvalid };
};

export const validateEmptyField = (value: string): FormValidationProps =>
  value ? { error: false } : { error: true, message: configs.form.validation.empty };

export const validateMinValue = (value: string, min: number): FormValidationProps =>
  Number(value) >= min
    ? { error: false }
    : { error: true, message: `${configs.form.validation.minNumber} ${min}` };
