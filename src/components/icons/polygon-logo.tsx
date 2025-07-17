import * as React from "react";

export const PolygonLogo = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M6.5 9.5 12 12l5.5-2.5" />
    <path d="m12 12-5.5 2.5L12 17l5.5-2.5" />
    <path d="M17.5 9.5 12 7l-5.5 2.5" />
    <path d="M12 12V7" />
    <path d="m12 12 5.5 2.5" />
    <path d="m12 12-5.5 2.5" />
  </svg>
);
