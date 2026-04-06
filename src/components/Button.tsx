import React, { ReactNode } from 'react';
import classnames from 'classnames';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ children, className, disabled, onClick }: ButtonProps) => (
  <button
    className={classnames(
      'tw-summarizer-px-4 tw-summarizer-py-2 tw-summarizer-bg-indigo-500 tw-summarizer-text-white tw-summarizer-text-sm tw-summarizer-font-medium tw-summarizer-rounded-lg tw-summarizer-cursor-pointer hover:tw-summarizer-bg-indigo-600 tw-summarizer-transition-colors',
      className
    )}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);
