import React, { ReactNode } from 'react';
import { Button } from './Button';
import { Accordion, AccordionTrigger, AccordionHeader, AccordionBody } from './Accordion';
import { Link } from './Link';

export interface FormProps {
  children: ReactNode;
  mainOption: ReactNode;
  saveSettings?: () => void;
}

export const Form = ({ children, mainOption, saveSettings }: FormProps) => (
  <div className="tw-summarizer-overflow-y-auto">
    <div className="tw-summarizer-divide-y">
      <div className="tw-summarizer-px-4 tw-summarizer-pb-4 tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-4">
        <p>
          Designed for Chrome, this browser extension is a helper utility that leverages generative
          AI capabilities to provide a way to save you time when reading any kind of long texts.
          <br />
          The version 1.0 exclusively relies on{' '}
          <Link href="https://openai.com/api/">OpenAI API</Link> to work, based on model{' '}
          <Link
            href="https://platform.openai.com/docs/models/gpt-3-5-turbo"
            target="_blank"
            rel="noreferrer"
          >
            GPT-3.5 Turbo
          </Link>
          . Other generative AIs like Gemini, from Google, might be supported in future versions.
        </p>
        {mainOption}
      </div>
      <div className="tw-summarizer-p-4 tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-4">
        <Accordion>
          <AccordionTrigger>
            <AccordionHeader>Additional Settings</AccordionHeader>
          </AccordionTrigger>
          <AccordionBody>
            <p className="tw-summarizer-pt-2">
              These settings determine how the extension is going to work for you. Since they can{' '}
              <strong>not</strong> be empty, there will be predefined values, carefully chosen, but
              you can change them according to your needs.
            </p>
            {children}
          </AccordionBody>
        </Accordion>
      </div>
      <div className="tw-summarizer-p-4 tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-4">
        <Button
          onClick={saveSettings}
          className="tw-summarizer-w-32 tw-summarizer-px-4 tw-summarizer-py-2 tw-summarizer-font-medium"
        >
          Save
        </Button>
      </div>
    </div>
  </div>
);
