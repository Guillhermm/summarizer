import React, { ReactNode } from 'react';

export interface FormProps {
  children: ReactNode;
}

export const Form = ({ children }: FormProps) => (
  <div className="tw-summarizer-overflow-y-auto">
    <div className="tw-summarizer-divide-y">
      {children}
    </div>
  </div>
);
