import React, { useEffect, useRef, ReactNode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { getProcessedCSS } from '../utils/domUtils';
import '../styles/index.css';

interface ShadowRootProps {
  children: ReactNode;
}

/**
 * This component provides a way to encapsulate styles in Shadow DOM so that they
 * don't bleed out to the parent page and vice versa.
 *
 * This is a common approach when injecting components into other web pages.
 */
export const ShadowRoot = ({ children }: ShadowRootProps) => {
  const shadowRootRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (shadowRootRef.current) {
      // Initiates shadow DOM.
      const shadowRoot = shadowRootRef.current.attachShadow({ mode: 'open' });
      const styleSheet = document.createElement('style');

      // Injects the processed Tailwind CSS into Shadow DOM.
      styleSheet.textContent = getProcessedCSS('style[data-tw-summarizer="true"]', true);
      shadowRoot.appendChild(styleSheet);

      const root = createRoot(shadowRoot);
      rootRef.current = root;
      root.render(children);
    }

    return () => {
      rootRef.current?.unmount();
    };
  }, [children]);

  return <div ref={shadowRootRef} />;
};
