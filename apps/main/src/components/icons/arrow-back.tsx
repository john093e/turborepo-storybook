import React from "react";

import type { BaseIconProps } from "@types";

interface ArrowBackProps extends BaseIconProps {}

function ArrowBack({ className, height, width }: ArrowBackProps) {
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
      <title>Arrow Back</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        ></path>
    </svg>
  );
}

export default ArrowBack;