import React from 'react';
import ReactDOM from 'react-dom/client';
import { Summarizer } from './summarizer';

const root = document.createElement('div');

document.body.appendChild(root);

const rootDiv = ReactDOM.createRoot(root);

rootDiv.render(
  <React.StrictMode>
    <Summarizer />
  </React.StrictMode>
);
