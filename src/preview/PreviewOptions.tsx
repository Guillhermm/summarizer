import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Form,
  FormOption,
  FormOptionsAdditional,
  FormOptionsMain,
  FormSubmit,
} from '../components/Form';
import { configs } from '../configs';
import {
  MAX_SUMMARIZED_TEXT,
  MIN_TEXT_LENGTH_ALLOWED,
  MIN_TEXT_WORDS_ALLOWED,
} from '../utils/constants';
import '../styles/index.css';

const PreviewOptions = () => {
  const { options } = configs;
  const [apiKey, setApiKey] = useState<string>('');
  const [maxLength, setMaxLength] = useState<number>(MAX_SUMMARIZED_TEXT);
  const [minChars, setMinChars] = useState<number>(MIN_TEXT_LENGTH_ALLOWED);
  const [minWords, setMinWords] = useState<number>(MIN_TEXT_WORDS_ALLOWED);

  const handleChangeKey = (value: string) => setApiKey(value);
  const handleChangeMaxLength = (value: string) => setMaxLength(Number(value));
  const handleChangeMinChars = (value: string) => setMinChars(Number(value));
  const handleChangeMinWords = (value: string) => setMinWords(Number(value));

  const Options = () => (
    <Form>
      <FormOptionsMain>
        <FormOption {...options.apiKey} handleChange={handleChangeKey} value={apiKey} isRequired />
      </FormOptionsMain>
      <FormOptionsAdditional>
        <FormOption
          {...options.maxLength}
          handleChange={handleChangeMaxLength}
          value={maxLength}
          isRequired
        />
        <FormOption
          {...options.minChars}
          handleChange={handleChangeMinChars}
          value={minChars}
          isRequired
        />
        <FormOption
          {...options.minWords}
          handleChange={handleChangeMinWords}
          value={minWords}
          isRequired
        />
      </FormOptionsAdditional>
      <FormSubmit />
    </Form>
  );

  return (
    <div className="tw-summarizer-w-screen tw-summarizer-h-screen tw-summarizer-flex tw-summarizer-items-center tw-summarizer-justify-center tw-summarizer-bg-black tw-summarizer-bg-opacity-10">
      <div className="tw-summarizer-w-[400px] tw-summarizer-max-h-screen tw-summarizer-overflow-y-auto tw-summarizer-bg-white tw-summarizer-absolute tw-summarizer-rounded-lg tw-summarizer-shadow-xl">
        <div className="tw-summarizer-pt-4">
          <Options />
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<PreviewOptions />);
}
