import React, { ReactNode } from 'react';
import { useAccordionContext } from './AccordionContext';

export interface AccordionBodyProps {
  children: ReactNode;
}

export const AccordionBody = ({ children }: AccordionBodyProps) => {
  const { isOpen } = useAccordionContext();

  return (
    <div
      className={`tw-summarizer-max-h-0 tw-summarizer-overflow-hidden tw-summarizer-transition-[max-height] tw-summarizer-ease-in-out tw-summarizer-duration-300 ${isOpen ? 'tw-summarizer-max-h-[500px]' : ''}`}
    >
      {isOpen && (
        <div className="tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-4">
          {children}
        </div>
      )}
    </div>
  );
};
