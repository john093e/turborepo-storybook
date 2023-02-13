import React from "react";

import type { BaseIconProps } from "@types";

interface TwitterProps extends BaseIconProps {}

function Twitter({ className, height, width }: TwitterProps) {
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
      <title>Twitter</title>
      <path fill="none" d="M0 0h24v24H0z"/>
      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"
      fill="rgba(245,56,56,1)"
      />
    </svg>
  );
}
export default Twitter;
