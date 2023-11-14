import React from 'react';

export const List: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        version="1.1"
        id="list"
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
          d="M90,33.5v13.4H10V33.5H90z M90,59.9v13.4H10V59.9H90z M10,99.8V86.7h53.1v13.1H10z M140.1,69.8l9.9,10l-46.6,46.7L73.2,96.6
	l9.9-9.9l20.3,19.9L140.1,69.8z"
        />
      </svg>
    );
  }
);
