import { configs } from '../configs';

export const validateEmptyField = (value: string) =>
  value ? undefined : configs.form.validation.empty;

export const validateMinValue = (value: string, min: number) =>
  Number(value) >= min ? undefined : `${configs.form.validation.minNumber} ${min}`;
