import React, { ReactNode } from 'react';
import { Accordion, AccordionTrigger, AccordionHeader, AccordionBody } from '../Accordion';

export interface FormOptionsAdditionalProps {
  children: ReactNode;
}

export const FormOptionsAdditional = ({ children }: FormOptionsAdditionalProps) => (
  <div className="tw-summarizer-p-4 tw-summarizer-flex tw-summarizer-flex-col tw-summarizer-gap-4">
    <Accordion>
      <AccordionTrigger>
        <AccordionHeader>Additional Settings</AccordionHeader>
      </AccordionTrigger>
      <AccordionBody>
        <p className="tw-summarizer-pt-2">
          These settings determine how the extension is going to work for you. Since they can{' '}
          <strong>not</strong> be empty, there will be predefined values, carefully chosen, but you
          can change them according to your needs.
        </p>
        {children}
      </AccordionBody>
    </Accordion>
  </div>
);
