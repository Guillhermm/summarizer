import React, { ReactNode } from 'react';
import classnames from 'classnames';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ children, className, onClick }: ButtonProps) => (
  <button
    className={classnames(
      'p-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600',
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
);
