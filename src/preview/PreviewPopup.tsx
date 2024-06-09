import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Popup as PopupUI } from '../components/Popup';
import '../styles/tailwind.css';

const Popup = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const handleToggleChange = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black bg-opacity-10">
      <div className="bg-white absolute rounded-lg shadow-xl">
        <PopupUI
          handleToggleChange={handleToggleChange}
          handleOptionsClick={() => {
            return;
          }}
          isEnabled={isEnabled}
        />
      </div>
    </div>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
