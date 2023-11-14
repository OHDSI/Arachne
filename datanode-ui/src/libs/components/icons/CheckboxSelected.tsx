import React from 'react';

export const CheckboxSelected: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="selected-checkbox"
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
          d="M143.8,18.7H21.3v122.5h122.5V18.7z M143.8,10c4.8,0,8.8,3.9,8.8,8.7v122.5c0,4.8-3.9,8.8-8.8,8.8H21.3
	c-4.8,0-8.8-3.9-8.8-8.8V18.7c0-4.8,3.9-8.7,8.8-8.7H143.8z"
        />
        <rect x="21.3" y="18.8" fill="#FFFFFF" width="122.5" height="122.5" />
        <path
          fill="#5C75A8"
          d="M127.6,48.4c0.3,0.6,0.4,1,0.4,1.3s-0.1,0.7-0.4,1.3l-53.9,69.2c-0.9,0.9-1.5,1.3-1.9,1.3
	c-0.7,0-1.4-0.4-2.2-1.1L39.1,91l-0.7-0.7c-0.3-0.6-0.4-1-0.4-1.3c0-0.1,0.1-0.5,0.4-1.1l0.4-0.4c4-4.3,7.2-7.6,9.5-9.9
	c0.9-0.9,1.4-1.3,1.7-1.3c0.6,0,1.3,0.4,2.2,1.3l17.3,16.9l43.3-55.6c0.3-0.3,0.7-0.4,1.3-0.4c0.4,0,0.9,0.1,1.5,0.4L127.6,48.4
	L127.6,48.4z"
        />
      </svg>
    );
  }
);
