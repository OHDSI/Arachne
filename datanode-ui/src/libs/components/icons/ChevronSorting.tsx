import React from 'react';

export const ChevronSorting: React.FC<any> = React.forwardRef(
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
        xmlSpace="preserve"
        {...rest}
      >
        <path
          fillRule="evenodd"
          d="M147.1,42.9c-3.8-3.8-10-3.8-13.8,0L80.1,96.4L26.6,43.2c-3.8-3.8-10-3.8-13.8,0s-3.8,10,0,13.8l60.2,60
   l0.1,0.1c3.8,3.8,10,3.8,13.8,0l0.2-0.2l59.9-60.2C151,52.9,150.9,46.7,147.1,42.9z"
        />
      </svg>
    );
  }
);
