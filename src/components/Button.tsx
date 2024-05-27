import React from 'react';
import classnames from 'classnames';

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

export const Button = ({ text, className, onClick }: ButtonProps) => (
  <button
    className={classnames(
      'p-2 bg-blue-500 text-white rounded cursor-pointer',
      className
    )}
    onClick={onClick}
  >
    {text}
  </button>
);
