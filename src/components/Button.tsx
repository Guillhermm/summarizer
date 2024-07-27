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
      'tw-summarizer-p-2 tw-summarizer-bg-blue-500 tw-summarizer-text-white tw-summarizer-rounded tw-summarizer-cursor-pointer hover:tw-summarizer-bg-blue-600',
      className
    )}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);
