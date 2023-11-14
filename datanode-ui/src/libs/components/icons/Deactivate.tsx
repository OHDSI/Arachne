import React from 'react';

export const Deactivate: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="deactivate"
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
          d="M132.6,20c-2.1,0-3.8,0.7-5.1,2.2L80,69.6L32.5,22.2c-1.4-1.5-3.1-2.2-5.1-2.2s-3.8,0.7-5.2,2.1c-1.4,1.4-2.1,3.2-2.1,5.2
	s0.7,3.8,2.2,5.1L69.6,80l-47.3,47.5c-1.5,1.4-2.2,3.1-2.2,5.1s0.7,3.8,2.1,5.2c1.4,1.4,3.2,2.1,5.2,2.1s3.8-0.7,5.1-2.2L80,90.2
	l47.5,47.5c1.4,1.5,3.1,2.2,5.1,2.2s3.8-0.7,5.2-2.1c1.4-1.4,2.1-3.2,2.1-5.2s-0.8-3.8-2.2-5.1L90.4,80l47.3-47.5
	c1.5-1.4,2.2-3.1,2.2-5.1s-0.7-3.8-2.1-5.2C136.4,20.7,134.7,20,132.6,20"
        />
      </svg>
    );
  }
);
