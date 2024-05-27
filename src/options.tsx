import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/Button';
import './styles/tailwind.css';

const Options = () => {
  const [apiKey, setApiKey] = useState('');
  const [maxLength, setMaxLength] = useState(100);

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
    <div className="p-4">
      <h1 className="text-xl font-bold">Options</h1>
      <p>Configure your settings here.</p>
      <div>
        <label>API Key</label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="border p-1 w-full"
        />
      </div>
      <div>
        <label>Max Length</label>
        <input
          type="number"
          value={maxLength}
          onChange={(e) => setMaxLength(parseInt(e.target.value))}
          className="border p-1 w-full"
        />
      </div>
      <Button
        onClick={saveSettings}
        className="mt-2 p-2 bg-blue-500 text-white"
      >
        Save
      </Button>
    </div>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<Options />);
}
