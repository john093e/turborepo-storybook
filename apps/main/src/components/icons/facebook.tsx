import React from "react";

import type { BaseIconProps } from "@types";

interface FacebookProps extends BaseIconProps {}

function Facebook({ className, height, width }: FacebookProps) {
  return (
    <svg
      x="0"
      y="0"
      width={width}
      height={height}
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      enableBackground="new 0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
    >
      <title>Facebook</title>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"
        fill="rgba(245,56,56,1)"
      />
    </svg>
  );
}

export default Facebook;
