import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Form } from './components/Form';
import { FormOption } from './components/FormOption';
import { ShadowRoot } from './components/ShadowRoot';
import { configs } from './configs';
import {
  MAX_SUMMARIZED_TEXT,
  MIN_TEXT_LENGTH_ALLOWED,
  MIN_TEXT_WORDS_ALLOWED,
} from './utils/constants';
import { sanitize } from './utils/sanitize';
import { validateMinValue } from './utils/formValidation';

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

  const handleChangeKey = (value: string) => setApiKey(sanitize(value));
  const handleChangeMaxLength = (value: string) => setMaxLength(Number(value));
  const handleChangeMinChars = (value: string) => setMinChars(Number(value));
  const handleChangeMinWords = (value: string) => setMinWords(Number(value));

  return (
    <Form
      mainOption={
        <FormOption {...options.apiKey} handleChange={handleChangeKey} value={apiKey} isRequired />
      }
      saveSettings={saveSettings}
    >
      <FormOption
        {...options.maxLength}
        handleChange={handleChangeMaxLength}
        value={maxLength}
        min={MAX_SUMMARIZED_TEXT}
        customValidation={(maxLength) => validateMinValue(maxLength, MAX_SUMMARIZED_TEXT)}
        isRequired
      />
      <FormOption
        {...options.minChars}
        handleChange={handleChangeMinChars}
        value={minChars}
        min={MIN_TEXT_LENGTH_ALLOWED}
        customValidation={(minChars) => validateMinValue(minChars, MIN_TEXT_LENGTH_ALLOWED)}
        isRequired
      />
      <FormOption
        {...options.minWords}
        handleChange={handleChangeMinWords}
        value={minWords}
        min={MIN_TEXT_WORDS_ALLOWED}
        customValidation={(minWords) => validateMinValue(minWords, MIN_TEXT_WORDS_ALLOWED)}
        isRequired
      />
    </Form>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ShadowRoot>
        <Options />
      </ShadowRoot>
    </React.StrictMode>
  );
}
