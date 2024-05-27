import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tailwind.css';

const Popup = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Loads the initial state from storage.
    chrome.storage.sync.get(['isEnabled'], (result) => {
      setIsEnabled(result.isEnabled ?? false);
    });
  }, []);

  const handleToggleChange = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    // Saves the new state to storage.
    chrome.storage.sync.set({ isEnabled: newValue });
  };

  return (
    <div className="grid grid-cols-1 divide-y divide-gray-200 w-64">
      <div className="px-4 py-3">
        <h1 className="text-lg font-bold">Summarizer</h1>
      </div>
      <div className="px-4 py-3">
        <label
          htmlFor="enableToggle"
          className="flex items-center cursor-pointer"
        >
          <div className="relative">
            <input
              type="checkbox"
              id="enableToggle"
              className="sr-only"
              checked={isEnabled}
              onChange={handleToggleChange}
            />
            <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
            <div
              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                isEnabled ? 'transform translate-x-full bg-blue-500' : ''
              }`}
            />
          </div>
          <div className="mx-3 text-base text-gray-600">Enable/Disable</div>
        </label>
      </div>
      <a
        className="px-4 py-3 text-base text-gray-600 hover:bg-gray-100"
        href="options.html"
        target="_blank"
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
