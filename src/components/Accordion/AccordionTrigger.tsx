import React, { ReactNode } from 'react';
import { useAccordionContext } from './AccordionContext';
import { IconArrowDown } from '../Icons';

export interface AccordionTriggerProps {
  children: ReactNode;
}

export const AccordionTrigger = ({ children }: AccordionTriggerProps) => {
  const { toggleOpen, isOpen } = useAccordionContext();

  return (
    <button
      onClick={toggleOpen}
      className="tw-summarizer-w-full tw-summarizer-flex tw-summarizer-justify-between tw-summarizer-items-center focus:tw-summarizer-outline-none"
    >
      {children}
      <IconArrowDown
        className={`tw-summarizer-w-6 tw-summarizer-h-6 tw-summarizer-transform tw-summarizer-transition-transform tw-summarizer-duration-250 ${isOpen ? 'tw-summarizer-rotate-180' : ''}`}
      />
    </button>
  );
};
