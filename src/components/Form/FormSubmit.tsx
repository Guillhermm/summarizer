import React from 'react';
import { Button } from '../Button';
import { configs } from '../../configs';

export interface FormSubmitProps {
  disabled?: boolean;
  saveSettings?: () => void;
}

export const FormSubmit = ({ disabled, saveSettings }: FormSubmitProps) => (
  <div className="!tw-summarizer-p-4 tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-4">
    <Button
      onClick={saveSettings}
      className="!tw-summarizer-font-medium !tw-summarizer-px-4 !tw-summarizer-py-2 tw-summarizer-w-32 disabled:tw-summarizer-opacity-75 disabled:tw-summarizer-pointer-events-none"
      disabled={disabled}
    >
      {configs.form.submit.label}
    </Button>
  </div>
);
