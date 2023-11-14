import React from 'react';

export const CheckboxIndeterminate: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="indeterminate-checkbox"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 160 160"
        style={{ enableBackground: 'new 0 0 160 160' }}
        xmlSpace="preserve"
        {...rest}
      >
        <path
          fill="#AEBBD4"
          d="M141.2,18.7H18.8v122.5h122.5V18.7z M141.2,10c4.8,0,8.8,3.9,8.8,8.7v122.5c0,4.8-3.9,8.8-8.8,8.8H18.8
	c-4.8,0-8.8-3.9-8.8-8.8V18.7c0-4.8,3.9-8.7,8.8-8.7H141.2z"
        />
        <rect x="18.8" y="18.8" fill="#FFFFFF" width="122.5" height="122.5" />
        <path
          fill="#5C75A8"
          d="M36.3,70.5h87.3c1.1,0,2,0.9,2,2v15c0,1.1-0.9,2-2,2H36.3c-1.1,0-2-0.9-2-2v-15C34.3,71.4,35.2,70.5,36.3,70.5z
	"
        />
      </svg>
    );
  }
);
