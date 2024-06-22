import React, { ReactNode } from 'react';

export interface AccordionHeaderProps {
  children: ReactNode;
}

export const AccordionHeader = ({ children }: AccordionHeaderProps) => (
  <span className="tw-summarizer-text-lg tw-summarizer-font-bold">{children}</span>
);
