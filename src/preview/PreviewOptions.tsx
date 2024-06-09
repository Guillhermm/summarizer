import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Form } from '../components/Form';
import { FormOption } from '../components/FormOption';
import { configs } from '../configs';
import {
  MAX_SUMMARIZED_TEXT,
  MIN_TEXT_LENGTH_ALLOWED,
  MIN_TEXT_WORDS_ALLOWED,
} from '../utils/constants';
import '../styles/tailwind.css';

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
    <Form
      mainOption={<FormOption {...options.apiKey} handleChange={handleChangeKey} value={apiKey} />}
      saveSettings={() => {
        return;
      }}
    >
      <FormOption {...options.maxLength} handleChange={handleChangeMaxLength} value={maxLength} />
      <FormOption {...options.minChars} handleChange={handleChangeMinChars} value={minChars} />
      <FormOption {...options.minWords} handleChange={handleChangeMinWords} value={minWords} />
    </Form>
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black bg-opacity-10">
      <div className="w-[400px] max-h-screen overflow-y-auto bg-white absolute rounded-lg shadow-xl">
        <div className="pt-4">
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
