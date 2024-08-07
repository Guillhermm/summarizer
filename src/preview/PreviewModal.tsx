import React from 'react';
import { createRoot } from 'react-dom/client';
import { Modal } from '../components/Modal';

const summarizedText = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
  culpa qui officia deserunt mollit anim id est laborum.
`;

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<Modal summarizedText={summarizedText} onClose={() => null} />);
}
