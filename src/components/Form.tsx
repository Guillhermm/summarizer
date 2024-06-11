import React, { ReactNode } from 'react';
import { Button } from './Button';

export interface FormProps {
  children: ReactNode;
  mainOption: ReactNode;
  saveSettings?: () => void;
}

export const Form = ({ children, mainOption, saveSettings }: FormProps) => (
  <div className="tw-summarizer-divide-y">
    <div className="tw-summarizer-px-4 tw-summarizer-pb-4 tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-4">
      <p>
        Designed for Chrome, this browser extension is a helper utility that leverages generative AI
        capabilities to provide a way to save you time when reading any kind of long texts.
        <br />
        The version 1.0 exclusively relies on <a href="https://openai.com/api/">OpenAI API</a> to
        work, based on model{' '}
        <a
          href="https://platform.openai.com/docs/models/gpt-3-5-turbo"
          target="_blank"
          rel="noreferrer"
        >
          GPT-3.5 Turbo
        </a>
        . Other generative AIs like Gemini, from Google, might be supported in future versions.
      </p>
      {mainOption}
    </div>
    <div className="tw-summarizer-p-4 tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-4">
      <h2 className="tw-summarizer-text-lg tw-summarizer-font-bold">Additional Settings</h2>
      <p>
        These settings determine how the extension is going to work for you. Since they can{' '}
        <strong>not</strong> be empty, there will be predefined values, carefully chosen, but you
        can change them according to your needs.
      </p>
      {children}
      <Button
        onClick={saveSettings}
        className="tw-summarizer-w-32 tw-summarizer-px-4 tw-summarizer-py-2 tw-summarizer-bg-blue-500 tw-summarizer-text-white"
      >
        Save
      </Button>
    </div>
  </div>
);
