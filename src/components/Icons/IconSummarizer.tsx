import React from 'react';

export const IconSummarizer = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="8" y1="8" x2="24" y2="8" />
    <line x1="24" y1="8" x2="8" y2="56" />
    <line x1="8" y1="56" x2="56" y2="56" />
    <line x1="33" y1="8" x2="56" y2="8" />
    <line x1="8" y1="24" x2="16" y2="24" />
    <line x1="28" y1="24" x2="56" y2="24" />
    <line x1="8" y1="40" x2="12" y2="40" />
    <line x1="22" y1="40" x2="56" y2="40" />
    <line x1="8" y1="8" x2="24" y2="8" />
    <line x1="24" y1="8" x2="8" y2="56" />
    <line x1="8" y1="56" x2="56" y2="56" />
  </svg>
);
