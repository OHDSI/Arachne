import React from 'react';

export const CheckboxEmpty: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="empty-checkbox"
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
        <rect x="18.8" y="18.7" fill="#FFFFFF" width="122.5" height="122.5" />
      </svg>
    );
  }
);
