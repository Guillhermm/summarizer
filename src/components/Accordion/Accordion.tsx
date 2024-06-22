import React, { ReactNode } from 'react';
import { AccordionProvider } from './AccordionContext';

export interface AccordionProps {
  children: ReactNode;
}

export const Accordion = ({ children }: AccordionProps) => {
  return (
    <AccordionProvider>
      <div>{children}</div>
    </AccordionProvider>
  );
};
