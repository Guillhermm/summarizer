import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Form } from './components/Form';
import {
  MAX_SUMMARIZED_TEXT,
  MIN_TEXT_LENGTH_ALLOWED,
  MIN_TEXT_WORDS_ALLOWED,
} from './utils/constants';
import './styles/tailwind.css';
import { FormOption } from './components/FormOption';
import { configs } from './configs';

const Options = () => {
  const { options } = configs;
  const [apiKey, setApiKey] = useState<string>('');
  const [maxLength, setMaxLength] = useState<number>(MAX_SUMMARIZED_TEXT);
  const [minChars, setMinChars] = useState<number>(MIN_TEXT_LENGTH_ALLOWED);
  const [minWords, setMinWords] = useState<number>(MIN_TEXT_WORDS_ALLOWED);

  useEffect(() => {
    chrome.storage.sync.get(['apiKey', 'maxLength', 'minChars', 'minWords'], (result) => {
      setApiKey(result.apiKey || '');
      setMaxLength(result.maxLength || MAX_SUMMARIZED_TEXT);
      setMinChars(result.minChars || MIN_TEXT_LENGTH_ALLOWED);
      setMinWords(result.minWords || MIN_TEXT_WORDS_ALLOWED);
    });
  }, []);

  const saveSettings = () => {
    chrome.storage.sync.set({ apiKey, maxLength, minWords, minChars });
  };

  const handleChangeKey = (value: string) => setApiKey(value);
  const handleChangeMaxLength = (value: string) => setMaxLength(Number(value));
  const handleChangeMinChars = (value: string) => setMinChars(Number(value));
  const handleChangeMinWords = (value: string) => setMinWords(Number(value));

  return (
    <Form
      mainOption={<FormOption {...options.apiKey} handleChange={handleChangeKey} value={apiKey} />}
      saveSettings={saveSettings}
    >
      <FormOption {...options.maxLength} handleChange={handleChangeMaxLength} value={maxLength} />
      <FormOption {...options.minChars} handleChange={handleChangeMinChars} value={minChars} />
      <FormOption {...options.minWords} handleChange={handleChangeMinWords} value={minWords} />
    </Form>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<Options />);
}
