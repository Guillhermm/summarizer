import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/Button';
import './styles/tailwind.css';

const Options = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [maxLength, setMaxLength] = useState<number>(100);
  const [minWords, setMinWords] = useState<number>(200);
  const [minChars, setMinChars] = useState<number>(1000);
  // useEffect(() => {
  //   chrome.storage.sync.get(['apiKey', 'maxLength'], (result) => {
  //     setApiKey(result.apiKey || '');
  //     setMaxLength(result.maxLength || 100);
  //   });
  // }, []);

  const saveSettings = () => {
    chrome.storage.sync.set({ apiKey, maxLength });
  };

  return (
    <div className="divide-y">
      <div className="px-4 pb-4 flex flex-col gap-4">
        <p>
          Designed for Chrome, this browser extension is a helper utility that
          leverages generative AI capabilities to provide a way to save you time
          when reading any kind of long texts.
          <br />
          The version 1.0 exclusively relies on{' '}
          <a href="https://openai.com/api/">OpenAI API</a> to work, based on
          model{' '}
          <a
            href="https://platform.openai.com/docs/models/gpt-3-5-turbo"
            target="_blank"
            rel="noreferrer"
          >
            GPT-3.5 Turbo
          </a>
          . Other generative AIs like Gemini, from Google, might be supported in
          future versions.
        </p>
        <div className="flex flex-col gap-1">
          <label className="font-bold">OpenAI API Key</label>
          <p>
            To use this extension, users have to create an account in OpenAI and
            get a key to set it in here.
          </p>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="border p-1 w-full"
            placeholder="API Key"
          />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <h2 className="text-lg font-bold">Additional Settings</h2>
        <p>
          These settings determine how the extension is going to work for you.
          Since they can <strong>not</strong> be empty, there will be predefined
          values, carefully chosen, but you can change them according to your
          needs.
        </p>
        <div className="flex flex-col gap-1">
          <label className="font-bold">Max Length</label>
          <input
            type="number"
            value={maxLength}
            onChange={(e) => setMaxLength(parseInt(e.target.value))}
            className="border p-1 w-full"
            placeholder="Max Length"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-bold">Min Words</label>
          <input
            type="number"
            value={minWords}
            onChange={(e) => setMinWords(parseInt(e.target.value))}
            className="border p-1 w-full"
            placeholder="Min Words"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-bold">Min Chars</label>
          <input
            type="number"
            value={minChars}
            onChange={(e) => setMinChars(parseInt(e.target.value))}
            className="border p-1 w-full"
            placeholder="Min Chars"
          />
        </div>
        <Button
          onClick={saveSettings}
          className="w-32 px-4 py-2 bg-blue-500 text-white"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<Options />);
}
