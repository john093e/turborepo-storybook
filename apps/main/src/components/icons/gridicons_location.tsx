import React from "react";

import type { BaseIconProps } from "@types";

interface Gridicons_locationProps extends BaseIconProps {}

function Gridicons_location({ className, color, height, width }: Gridicons_locationProps) {
  return (
    <svg 
    x="0"
    y="0"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 24 25"
    enableBackground="new 0 0 24 25"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    >
      <title>Gridicons location</title>
      <path
        fill={color}
        d="M19 9.54932C19 8.63006 18.8189 7.71981 18.4672 6.87053C18.1154 6.02125 17.5998 5.24958 16.9497 4.59957C16.2997 3.94956 15.5281 3.43394 14.6788 3.08216C13.8295 2.73038 12.9193 2.54932 12 2.54932C11.0807 2.54932 10.1705 2.73038 9.32122 3.08216C8.47194 3.43394 7.70026 3.94956 7.05025 4.59957C6.40024 5.24958 5.88463 6.02125 5.53284 6.87053C5.18106 7.71981 5 8.63006 5 9.54932C5 10.9363 5.41 12.2263 6.105 13.3143H6.097C8.457 17.0093 12 22.5493 12 22.5493L17.903 13.3143H17.896C18.6164 12.1907 18.9995 10.8841 19 9.54932ZM12 12.5493C11.2044 12.5493 10.4413 12.2332 9.87868 11.6706C9.31607 11.108 9 10.345 9 9.54932C9 8.75367 9.31607 7.99061 9.87868 7.428C10.4413 6.86539 11.2044 6.54932 12 6.54932C12.7956 6.54932 13.5587 6.86539 14.1213 7.428C14.6839 7.99061 15 8.75367 15 9.54932C15 10.345 14.6839 11.108 14.1213 11.6706C13.5587 12.2332 12.7956 12.5493 12 12.5493Z" 
      />
    </svg>
  );
}

export default Gridicons_location;



