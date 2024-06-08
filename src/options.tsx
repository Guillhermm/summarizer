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

const Options = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [maxLength, setMaxLength] = useState<number>(MAX_SUMMARIZED_TEXT);
  const [minWords, setMinWords] = useState<number>(MIN_TEXT_WORDS_ALLOWED);
  const [minChars, setMinChars] = useState<number>(MIN_TEXT_LENGTH_ALLOWED);

  useEffect(() => {
    chrome.storage.sync.get(['apiKey', 'maxLength', 'minWords', 'minChars'], (result) => {
      setApiKey(result.apiKey || '');
      setMaxLength(result.maxLength || MAX_SUMMARIZED_TEXT);
      setMinWords(result.minWords || MIN_TEXT_WORDS_ALLOWED);
      setMinChars(result.minChars || MIN_TEXT_LENGTH_ALLOWED);
    });
  }, []);

  const saveSettings = () => {
    chrome.storage.sync.set({ apiKey, maxLength, minWords, minChars });
  };

  const configs = {
    apiKey: {
      label: 'OpenAI API Key',
      placeholder: 'API Key',
      text: 'To use this extension, users have to create an account in OpenAI and get a key to set it in here.',
      type: 'text',
    },
    maxLength: {
      label: 'Max Length',
      type: 'number',
    },
    minChars: {
      label: 'Min Chars',
      type: 'number',
    },
    minWords: {
      label: 'Min Words',
      type: 'number',
    },
  };

  return (
    <Form
      mainOption={<FormOption {...configs.apiKey} handleChange={setApiKey} value={apiKey} />}
      saveSettings={saveSettings}
    >
      <FormOption {...configs.maxLength} handleChange={setMaxLength} value={maxLength} />
      <FormOption {...configs.minChars} handleChange={setMinChars} value={minChars} />
      <FormOption {...configs.minWords} handleChange={setMinWords} value={minWords} />
    </Form>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<Options />);
}
