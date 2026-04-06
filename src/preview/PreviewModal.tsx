import React from 'react';
import { createRoot } from 'react-dom/client';

// Legacy preview — Modal component removed in v2.0.0.
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<div />);
}
