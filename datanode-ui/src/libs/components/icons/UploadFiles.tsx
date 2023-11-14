import React from 'react';

export const UploadFiles: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="Layer_1"
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
          d="M30,140h100V20H70v32.5c0,4.1-3.4,7.5-7.5,7.5H30V140z M60,20.6c-1.3,0.5-2.7,1.2-3.2,1.7L32.3,46.8
	c-0.5,0.5-1.2,1.9-1.7,3.2H60L60,20.6L60,20.6z M25.3,39.7l24.4-24.4c2.9-2.9,8.7-5.3,12.8-5.3h70c4.1,0,7.5,3.4,7.5,7.5v125
	c0,4.1-3.4,7.5-7.5,7.5h-105c-4.1,0-7.5-3.4-7.5-7.5v-90C20,48.4,22.4,42.6,25.3,39.7z"
        />
      </svg>
    );
  }
);
