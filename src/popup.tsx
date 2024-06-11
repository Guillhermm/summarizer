import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Popup as PopupUI } from './components/Popup';
import { ShadowRoot } from './components/ShadowRoot';

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
    <PopupUI
      handleToggleChange={handleToggleChange}
      handleOptionsClick={handleOptionsClick}
      isEnabled={isEnabled}
    />
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ShadowRoot>
        <Popup />
      </ShadowRoot>
    </React.StrictMode>
  );
}
