import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Form,
  FormOption,
  FormOptionsAdditional,
  FormOptionsMain,
  FormSubmit,
} from './components/Form';
import { StylesWrapper } from './components/StylesWrapper';
import { configs } from './configs';
import {
  MAX_SUMMARIZED_TEXT,
  MIN_TEXT_LENGTH_ALLOWED,
  MIN_TEXT_WORDS_ALLOWED,
} from './utils/constants';
import { sanitize } from './utils/sanitize';
import { validateApiKey, validateMinValue } from './utils/formValidation';

const Options = () => {
  const { options } = configs;
  const [apiKey, setApiKey] = useState<string>('');
  const [maxLength, setMaxLength] = useState<number>(MAX_SUMMARIZED_TEXT);
  const [minChars, setMinChars] = useState<number>(MIN_TEXT_LENGTH_ALLOWED);
  const [minWords, setMinWords] = useState<number>(MIN_TEXT_WORDS_ALLOWED);
  // Starts with true because API Key is initial empty.
  const [formHasErrors, setFormHasErrors] = useState<boolean>(true);

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
    <Form>
      <FormOptionsMain>
        <FormOption
          {...options.apiKey}
          handleChange={handleChangeKey}
          value={apiKey}
          customAsyncValidation={(apiKey) => validateApiKey(apiKey)}
          setFormHasErrors={setFormHasErrors}
          isRequired
        />
      </FormOptionsMain>
      <FormOptionsAdditional>
        <FormOption
          {...options.maxLength}
          handleChange={handleChangeMaxLength}
          value={maxLength}
          min={MAX_SUMMARIZED_TEXT}
          customValidation={(maxLength) => validateMinValue(maxLength, MAX_SUMMARIZED_TEXT)}
          setFormHasErrors={setFormHasErrors}
          isRequired
        />
        <FormOption
          {...options.minChars}
          handleChange={handleChangeMinChars}
          value={minChars}
          min={MIN_TEXT_LENGTH_ALLOWED}
          customValidation={(minChars) => validateMinValue(minChars, MIN_TEXT_LENGTH_ALLOWED)}
          setFormHasErrors={setFormHasErrors}
          isRequired
        />
        <FormOption
          {...options.minWords}
          handleChange={handleChangeMinWords}
          value={minWords}
          min={MIN_TEXT_WORDS_ALLOWED}
          customValidation={(minWords) => validateMinValue(minWords, MIN_TEXT_WORDS_ALLOWED)}
          setFormHasErrors={setFormHasErrors}
          isRequired
        />
      </FormOptionsAdditional>
      <FormSubmit disabled={formHasErrors} saveSettings={saveSettings} />
    </Form>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <StylesWrapper>
        <Options />
      </StylesWrapper>
    </React.StrictMode>
  );
}
