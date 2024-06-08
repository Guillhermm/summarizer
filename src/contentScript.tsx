import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Summarizer as SummarizerUI } from './components/Summarizer';
import {
  MAX_SUMMARIZED_TEXT,
  MIN_TEXT_LENGTH_ALLOWED,
  MIN_TEXT_WORDS_ALLOWED,
} from './utils/constants';

const Summarizer = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [maxLength, setMaxLength] = useState<number>(MAX_SUMMARIZED_TEXT);
  const [minWords, setMinWords] = useState<number>(MIN_TEXT_WORDS_ALLOWED);
  const [minChars, setMinChars] = useState<number>(MIN_TEXT_LENGTH_ALLOWED);

  useEffect(() => {
    // Loads the initial state from storage.
    chrome.storage.sync
      .get(['isEnabled', 'maxLength', 'minWords', 'minChars'])
      .then((result) => {
        const { isEnabled, maxLength, minWords, minChars } = result;
        console.log('result', result);
        if (isEnabled) setIsEnabled(Boolean(isEnabled));
        if (maxLength) setMaxLength(Number(maxLength));
        if (minWords) setMinWords(Number(minWords));
        if (minChars) setMinChars(Number(minChars));
      });

    // Watches for any changes in options.
    chrome.storage.onChanged.addListener((changes, namespace) => {
      console.log('changes', changes);
      if (namespace === 'sync') {
        const { isEnabled, maxLength, minWords, minChars } = changes;

        if (isEnabled) setIsEnabled(Boolean(isEnabled.newValue));
        if (maxLength) setMaxLength(Number(maxLength.newValue));
        if (minWords) setMinWords(Number(minWords.newValue));
        if (minChars) setMinChars(Number(minChars.newValue));
      }
    });
  }, []);

  return (
    <SummarizerUI
      isEnabled={isEnabled}
      maxLength={maxLength}
      minWords={minWords}
      minChars={minChars}
    />
  );
};

const root = document.createElement('div');

document.body.appendChild(root);

const rootDiv = ReactDOM.createRoot(root);

rootDiv.render(
  <React.StrictMode>
    <Summarizer />
  </React.StrictMode>
);
