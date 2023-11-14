import React from 'react';

export const Chevron: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="chevron"
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
          fill="evenodd"
          d="M148.6,43.9c-1.9-1.9-4.9-1.9-6.7,0c0,0,0,0,0,0l-61.7,62l-62-61.7c-1.7-2-4.7-2.2-6.7-0.5
	c-2,1.7-2.2,4.7-0.5,6.7c0.2,0.2,0.3,0.4,0.5,0.5l65.3,65c0,0,0,0.1,0.1,0.1c0.7,0.7,1.5,1.1,2.5,1.3c1.6,0.3,3.2-0.2,4.3-1.3
	l0.1-0.1l65-65.2C150.5,48.8,150.5,45.8,148.6,43.9C148.6,43.9,148.6,43.9,148.6,43.9z"
        />
      </svg>
    );
  }
);
