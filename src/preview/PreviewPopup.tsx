import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Popup as PopupUI } from '../components/Popup';
import { StylesWrapper } from '../components/StylesWrapper';
import '../styles/main.css';

const Popup = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const handleToggleChange = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
  };

  return (
    <div className="tw-summarizer-w-screen tw-summarizer-h-screen tw-summarizer-flex tw-summarizer-items-center tw-summarizer-justify-center tw-summarizer-bg-black tw-summarizer-bg-opacity-10">
      <div className="tw-summarizer-bg-white tw-summarizer-absolute tw-summarizer-rounded-lg tw-summarizer-shadow-xl tw-summarizer-overflow-hidden">
        <StylesWrapper>
          <PopupUI
            handleToggleChange={handleToggleChange}
            handleOptionsClick={() => {
              return;
            }}
            isEnabled={isEnabled}
          />
        </StylesWrapper>
      </div>
    </div>
  );
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
