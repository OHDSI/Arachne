import React from 'react';

export const Edit: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="edit"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 160 160"
        style={{ enableBackground: 'new 0 0 160 160' }}
        xmlSpace="preserve"
        {...rest}
      >
        <polygon points="10,120.9 96.1,34.8 125.2,64 39.1,150 10,150 " />
        <path
          d="M147.8,41.4l-14.2,14.2l-29.1-29.1l14.2-14.2c1.5-1.5,3.3-2.2,5.5-2.2s4,0.8,5.5,2.2l18.1,18.1c1.5,1.5,2.2,3.3,2.2,5.5
	S149.3,39.9,147.8,41.4L147.8,41.4z"
        />
      </svg>
    );
  }
);
