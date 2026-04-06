import React, { ReactNode } from 'react';
import { Link } from '../Link';

export interface FormOptionsMainProps {
  children: ReactNode;
}

export const FormOptionsMain = ({ children }: FormOptionsMainProps) => (
  <div className="tw-summarizer-px-4 tw-summarizer-py-4 tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-4">
    <div className="tw-summarizer-text-sm tw-summarizer-text-gray-600 tw-summarizer-leading-relaxed tw-summarizer-space-y-2">
      <p>
        <strong className="tw-summarizer-text-gray-800">Summarizer</strong> is a page triager that
        assesses any article before you commit your time, surfacing the main argument, estimated
        reading time, content type, knowledge level, and a plain verdict.
      </p>
      <p>
        <strong>Choose your preferred AI provider below.</strong>
        <br />
        <ul className="tw-summarizer-list-disc tw-summarizer-pl-4 tw-summarizer-space-y-1 tw-summarizer-text-gray-500">
          <li>
            <strong className="tw-summarizer-text-gray-800">Chrome AI</strong> runs fully
            on-device (no API key needed), but requires a one-time model download and may be slower.
          </li>
          <li>
            <strong className="tw-summarizer-text-gray-800">Cloud providers</strong> (OpenAI,
            Claude, Gemini, DeepSeek) are faster and return a richer structured triage, but require
            an API key.
          </li>
        </ul>
      </p>
    </div>
    {children}
    <div className="tw-summarizer-text-xs tw-summarizer-text-gray-400 tw-summarizer-pt-2 tw-summarizer-border-t tw-summarizer-border-gray-100">
      v2.0.0 •{' '}
      <Link href="https://github.com/Guillhermm/summarizer" target="_blank" rel="noreferrer">
        GitHub
      </Link>
    </div>
  </div>
);
