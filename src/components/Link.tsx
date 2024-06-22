import React, { ReactNode } from 'react';
import classnames from 'classnames';

export interface LinkProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  href: string;
  className?: string;
  children: ReactNode;
}

export const Link = ({ href, className, children, ...rest }: LinkProps) => (
  <a
    href={href}
    className={classnames(
      className,
      'tw-summarizer-underline tw-summarizer-font-medium tw-summarizer-text-blue-500 hover:tw-summarizer-text-blue-600'
    )}
    {...rest}
  >
    {children}
  </a>
);
