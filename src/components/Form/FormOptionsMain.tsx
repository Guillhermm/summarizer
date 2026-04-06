import React, { ReactNode } from 'react';
import { Link } from '../Link';

export interface FormOptionsMainProps {
  children: ReactNode;
}

export const FormOptionsMain = ({ children }: FormOptionsMainProps) => (
  <div className="!tw-summarizer-px-4 tw-summarizer-pb-4 tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-4">
    <div>
      <strong>Page Triage</strong> assesses any article before you commit your time — surfacing the
      main argument, reading time, content type, and a plain verdict.
      <br />
      <br />
      On Chrome 131+, everything runs on-device via{' '}
      <Link
        href="https://developer.chrome.com/docs/ai/built-in"
        target="_blank"
        rel="noreferrer"
      >
        Chrome&apos;s built-in AI
      </Link>{' '}
      — private, free, no key needed. On other browsers, it falls back to{' '}
      <Link href="https://openai.com/api/" target="_blank" rel="noreferrer">
        OpenAI
      </Link>{' '}
      (
      <Link
        href="https://platform.openai.com/docs/models/gpt-4o-mini"
        target="_blank"
        rel="noreferrer"
      >
        GPT-4o mini
      </Link>
      ) if a key is provided below.
    </div>
    <div>
      v2.0.0 •{' '}
      <Link href="https://github.com/Guillhermm/summarizer" target="_blank" rel="noreferrer">
        Github
      </Link>
    </div>
    {children}
  </div>
);
