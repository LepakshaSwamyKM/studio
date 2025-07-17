import * as React from "react";

export const ArbitrumLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 12l-8 4.5" />
    <path d="M12 12l8 4.5" />
    <path d="M12 21V12" />
    <path d="M12 12L4 7.5" />
    <path d="M12 12l8-4.5" />
    <path d="M12 3v9" />
  </svg>
);
