import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { IconSummarizer } from './components/Icons/IconSummarizer';
import './styles/tailwind.css';

const Popup = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Loads the initial state from storage.
    chrome.storage.sync.get(['isEnabled']).then((result) => {
      setIsEnabled(result.isEnabled ?? false);
    });
  }, []);

  const handleToggleChange = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    // Saves the new state to storage.
    chrome.storage.sync.set({ isEnabled: newValue });
  };

  const handleOptionsClick = () => {
    // Opens options in extension manager popup.
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  };

  return (
    <div className="grid grid-cols-1 divide-y divide-gray-200 w-64">
      <div className="px-4 py-2">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <IconSummarizer className="w-6 h-6" />
          Summarizer
        </h1>
      </div>
      <div className="px-4 py-2">
        <label
          htmlFor="enableToggle"
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="relative">
            <input
              type="checkbox"
              id="enableToggle"
              className="sr-only"
              checked={isEnabled}
              onChange={handleToggleChange}
            />
            <div
              className={`block w-10 h-6 rounded-full ${
                isEnabled ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
            <div
              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                isEnabled ? 'transform translate-x-full' : ''
              }`}
            />
          </div>
          <div className="text-base text-gray-700">Enable/Disable</div>
        </label>
      </div>
      <a
        className="px-4 py-2 text-base text-gray-700 cursor-pointer hover:bg-gray-100"
        onClick={handleOptionsClick}
      >
        Options
      </a>
    </div>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
