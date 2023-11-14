import React from 'react';

export const Collapse: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="collapse"
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
          d="M146.6,13.3c-2.1-2.1-5-3.3-8-3.3H21.2c-3-0.1-5.9,1.1-8,3.3c-2.2,2.1-3.3,5-3.3,8v117.5c0,3,1.2,5.8,3.3,7.9
	c2.1,2.2,5,3.4,8,3.4h117.5c6.2-0.1,11.1-5.1,11.2-11.2V21.2C150,18.2,148.8,15.3,146.6,13.3z M138.6,138.8H21.2V21.2h117.4
	L138.6,138.8z"
        />
        <path
          d="M114.3,74.4c1.5,0,3,0.6,4,1.7c1.1,1,1.7,2.4,1.7,3.9c0,3.1-2.5,5.6-5.6,5.6c0,0,0,0,0,0H45.7c-3.1,0-5.6-2.4-5.6-5.5
	c0-1.5,0.6-3,1.6-4c1-1.1,2.5-1.7,4-1.7"
        />
      </svg>
    );
  }
);
