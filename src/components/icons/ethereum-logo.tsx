import * as React from "react";

export const EthereumLogo = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M12 3v6l6 3-6 9-6-9 6-3V3z" />
    <path d="M12 12l6 3" />
    <path d="M12 12L6 15" />
  </svg>
);
