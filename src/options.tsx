import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Form } from './components/Form';
import {
  MAX_SUMMARIZED_TEXT,
  MIN_TEXT_LENGTH_ALLOWED,
  MIN_TEXT_WORDS_ALLOWED,
} from './utils/constants';
import './styles/tailwind.css';

const Options = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [maxLength, setMaxLength] = useState<number>(MAX_SUMMARIZED_TEXT);
  const [minWords, setMinWords] = useState<number>(MIN_TEXT_WORDS_ALLOWED);
  const [minChars, setMinChars] = useState<number>(MIN_TEXT_LENGTH_ALLOWED);

  useEffect(() => {
    chrome.storage.sync.get(
      ['apiKey', 'maxLength', 'minWords', 'minChars'],
      (result) => {
        setApiKey(result.apiKey || '');
        setMaxLength(result.maxLength || MAX_SUMMARIZED_TEXT);
        setMinWords(result.minWords || MIN_TEXT_WORDS_ALLOWED);
        setMinChars(result.minChars || MIN_TEXT_LENGTH_ALLOWED);
      }
    );
  }, []);

  const saveSettings = () => {
    chrome.storage.sync.set({ apiKey, maxLength, minWords, minChars });
  };

  return (
    <Form
      apiKey={apiKey}
      maxLength={maxLength}
      minChars={minChars}
      minWords={minWords}
      saveSettings={saveSettings}
      setApiKey={setApiKey}
      setMaxLength={setMaxLength}
      setMinChars={setMinChars}
      setMinWords={setMinWords}
    />
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<Options />);
}
