import React from "react";

import type { BaseIconProps } from "@types";

interface ArrowNextProps extends BaseIconProps {}

function ArrowNext({ className, height, width }: ArrowNextProps) {
  return (
    <svg
      x="0"
      y="0"
      width={width}
      height={height}
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      enableBackground="new 0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
    >
      <title>Arrow Next</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        ></path>
    </svg>
  );
}

export default ArrowNext;