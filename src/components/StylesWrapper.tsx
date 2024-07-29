import React, { ReactNode } from 'react';
import '../styles/main.css';

interface StylesWrapperProps {
  children: ReactNode;
}

/**
 * This component provides a way to encapsulate styles within a selector so that they
 * don't bleed out to the parent page.
 */
export const StylesWrapper = ({ children }: StylesWrapperProps) => (
  <div className="summarizer">{children}</div>
);
