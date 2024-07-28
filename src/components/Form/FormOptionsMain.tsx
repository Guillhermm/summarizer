import React, { ReactNode } from 'react';
import { Link } from '../Link';

export interface FormOptionsMainProps {
  children: ReactNode;
}

export const FormOptionsMain = ({ children }: FormOptionsMainProps) => (
  <div className="tw-summarizer-px-4 tw-summarizer-pb-4 tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-4">
    <p>
      Designed for Chrome, this browser extension is a helper utility that leverages generative
      AI capabilities to provide a way to save you time when reading any kind of long texts.
      <br />
      The version 1.0 exclusively relies on{' '}
      <Link href="https://openai.com/api/" target="_blank" rel="noreferrer">
        OpenAI API
      </Link>{' '}
      to work, based on model{' '}
      <Link
        href="https://platform.openai.com/docs/models/gpt-3-5-turbo"
        target="_blank"
        rel="noreferrer"
      >
        GPT-3.5 Turbo
      </Link>
      . Other generative AIs like Gemini, from Google, might be supported in future versions.
    </p>
    <div>v1.0.0 • <Link href="https://github.com/Guillhermm/summarizer" target="_blank" rel="noreferrer">Github</Link></div>
    {children}
  </div>
);
