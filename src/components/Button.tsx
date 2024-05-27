import React, { ReactNode } from 'react';
import classnames from 'classnames';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button = ({ children, className, onClick }: ButtonProps) => (
  <button
    className={classnames(
      'p-2 bg-blue-500 text-white rounded cursor-pointer',
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
);
