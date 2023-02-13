import React from "react";

import type { BaseIconProps } from "@types";

interface Heroicons_smUserProps extends BaseIconProps {}

function Heroicons_smUser({ className, color, height, width }: Heroicons_smUserProps) {
  return (
    <svg 
    x="0"
    y="0"
    width={width}
    height={height}
    className={className}
    fill="none"
    viewBox="0 0 25 25"
    enableBackground="new 0 0 25 25"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    >
      <title>Heroicons_sm-user</title>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M12.5 11.3493C13.4548 11.3493 14.3705 10.97 15.0456 10.2949C15.7207 9.61975 16.1 8.70407 16.1 7.74929C16.1 6.79451 15.7207 5.87884 15.0456 5.20371C14.3705 4.52858 13.4548 4.14929 12.5 4.14929C11.5452 4.14929 10.6296 4.52858 9.95442 5.20371C9.27929 5.87884 8.90001 6.79451 8.90001 7.74929C8.90001 8.70407 9.27929 9.61975 9.95442 10.2949C10.6296 10.97 11.5452 11.3493 12.5 11.3493ZM7.39866 22.1493C5.57686 22.1493 4.04225 20.6179 4.73942 18.9347C5.16156 17.9156 5.7803 16.9896 6.56031 16.2096C7.34032 15.4296 8.26633 14.8108 9.28547 14.3887C10.3046 13.9666 11.3969 13.7493 12.5 13.7493C13.6031 13.7493 14.6954 13.9666 15.7145 14.3887C16.7337 14.8108 17.6597 15.4296 18.4397 16.2096C19.2197 16.9896 19.8385 17.9156 20.2606 18.9347C20.9578 20.6179 19.4232 22.1493 17.6014 22.1493H7.39866Z" 
        fill={color}
      />
    </svg>
  );
}

export default Heroicons_smUser;



