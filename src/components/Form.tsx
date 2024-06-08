import React, { ReactNode } from 'react';
import { Button } from './Button';
import '../styles/tailwind.css';

export interface FormProps {
  children: ReactNode;
  mainOption: ReactNode;
  saveSettings?: () => void;
}

export const Form = ({ children, mainOption, saveSettings }: FormProps) => (
  <div className="divide-y">
    <div className="px-4 pb-4 flex flex-col gap-4">
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
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-lg font-bold">Additional Settings</h2>
      <p>
        These settings determine how the extension is going to work for you. Since they can{' '}
        <strong>not</strong> be empty, there will be predefined values, carefully chosen, but you
        can change them according to your needs.
      </p>
      {children}
      <Button onClick={saveSettings} className="w-32 px-4 py-2 bg-blue-500 text-white">
        Save
      </Button>
    </div>
  </div>
);
