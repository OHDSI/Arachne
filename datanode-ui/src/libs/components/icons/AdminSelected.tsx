import { useTheme } from '@mui/material';
import React from 'react';

export const AdminSelected: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    const theme = useTheme();
    return (
      <svg
        ref={ref}
        version="1.1"
        id="admin"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 160 160"
        xmlSpace="preserve"
        {...rest}
      >
        <path
          fill="#fbd0ff"
          d="M142.3,62.5h-9.8c-0.5,0-0.9-0.3-1-0.7c-0.6-1.8-1.4-3.6-2.2-5.3c-0.2-0.4-0.1-0.9,0.2-1.3l6.9-6.9
	c3-3,3-7.8,0-10.8l0,0l-13.9-13.9c-3-3-7.8-3-10.8,0l0,0l-6.9,6.9c-0.3,0.3-0.8,0.4-1.3,0.2c-1.7-0.8-3.5-1.5-5.3-2.2
	c-0.4-0.1-0.7-0.6-0.7-1v-9.8c0-4.2-3.4-7.7-7.7-7.7H70.1c-4.2,0-7.7,3.4-7.7,7.7v9.8c0,0.5-0.3,0.9-0.7,1c-1.8,0.6-3.6,1.4-5.3,2.2
	c-0.4,0.2-0.9,0.1-1.3-0.2l-6.9-6.9c-3-3-7.8-3-10.8,0l0,0L23.5,37.5c-3,3-3,7.8,0,10.8l0,0l6.9,6.9c0.3,0.3,0.4,0.8,0.2,1.3
	c-0.8,1.7-1.5,3.5-2.2,5.3c-0.1,0.4-0.6,0.7-1,0.7h-9.8c-4.2,0-7.7,3.4-7.7,7.7v19.7c0,4.2,3.4,7.7,7.7,7.7h9.8c0.5,0,0.9,0.3,1,0.7
	c0.6,1.8,1.4,3.6,2.2,5.3c0.2,0.4,0.1,0.9-0.2,1.3l-6.9,6.9c-3,3-3,7.8,0,10.8l0,0l13.9,13.9c3,3,7.8,3,10.8,0l0,0l6.9-6.9
	c0.3-0.3,0.8-0.4,1.3-0.2c1.7,0.8,3.5,1.6,5.3,2.2c0.4,0.1,0.7,0.6,0.7,1v9.8c0,4.2,3.4,7.7,7.7,7.7h19.7c4.2,0,7.7-3.4,7.7-7.7l0,0
	v-9.8c0-0.5,0.3-0.9,0.7-1c1.8-0.6,3.6-1.4,5.3-2.2c0.4-0.2,0.9-0.1,1.3,0.2l6.9,6.9c3,3,7.8,3,10.8,0l0,0l13.9-13.9
	c3-3,3-7.8,0-10.8l0,0l-6.9-6.9c-0.3-0.3-0.4-0.8-0.2-1.3c0.8-1.7,1.6-3.5,2.2-5.3c0.1-0.4,0.6-0.7,1-0.7h9.8c4.2,0,7.7-3.4,7.7-7.7
	V70.2C150,65.9,146.6,62.5,142.3,62.5z"
        />
        <path
          fill={theme.palette.primary.main || '#A9BAD4'}
          d="M142.3,62.5h-9.8c-0.5,0-0.9-0.3-1-0.7c-0.6-1.8-1.4-3.6-2.2-5.3c-0.2-0.4-0.1-0.9,0.2-1.3l6.9-6.9
	c3-3,3-7.8,0-10.8l0,0l-13.9-13.9c-1.5-1.5-3.4-2.2-5.4-2.2c-2,0-3.9,0.8-5.4,2.2l0,0l-6.9,6.9c-0.2,0.2-0.5,0.3-0.8,0.3
	c-0.2,0-0.3,0-0.5-0.1c-1.7-0.8-3.5-1.5-5.3-2.2c-0.4-0.1-0.7-0.6-0.7-1v-9.8c0-4.2-3.4-7.7-7.7-7.7H70.2c-4.2,0-7.7,3.4-7.7,7.7
	v9.8c0,0.5-0.3,0.9-0.7,1c-1.8,0.6-3.6,1.4-5.3,2.2c-0.2,0.1-0.3,0.1-0.5,0.1c-0.3,0-0.6-0.1-0.8-0.3l-6.9-6.9
	c-1.5-1.5-3.5-2.2-5.4-2.2s-3.9,0.8-5.4,2.2l0,0L23.6,37.5c-3,3-3,7.8,0,10.8l0,0l6.9,6.9c0.3,0.3,0.4,0.8,0.2,1.3
	c-0.8,1.7-1.5,3.5-2.2,5.3c-0.1,0.4-0.6,0.7-1,0.7h-9.8c-4.2,0-7.7,3.4-7.7,7.7v19.7c0,4.2,3.4,7.7,7.7,7.7h9.8c0.5,0,0.9,0.3,1,0.7
	c0.6,1.8,1.4,3.6,2.2,5.3c0.2,0.4,0.1,0.9-0.2,1.3l-6.9,6.9c-3,3-3,7.8,0,10.8l0,0l13.9,13.9c1.5,1.5,3.5,2.2,5.4,2.2
	s3.9-0.8,5.4-2.2l0,0l6.9-6.9c0.2-0.2,0.5-0.3,0.8-0.3c0.2,0,0.3,0,0.5,0.1c1.7,0.8,3.5,1.6,5.3,2.2c0.4,0.1,0.7,0.6,0.7,1v9.8
	c0,4.2,3.4,7.7,7.7,7.7h19.7c4.1,0,7.5-3.3,7.6-7.4c0-0.1,0-0.2,0-0.4v-9.8c0.1-0.4,0.3-0.8,0.7-0.9c1.8-0.6,3.6-1.4,5.3-2.2
	c0.2-0.1,0.3-0.1,0.5-0.1c0.3,0,0.6,0.1,0.8,0.3l6.9,6.9c1.5,1.5,3.4,2.2,5.4,2.2s3.9-0.8,5.4-2.2l0,0l13.9-13.9c3-3,3-7.8,0-10.8
	l0,0l-6.9-6.9c-0.3-0.3-0.4-0.8-0.2-1.3c0.8-1.7,1.6-3.5,2.2-5.3c0.1-0.4,0.6-0.7,1-0.7h9.8c4.2,0,7.7-3.4,7.7-7.7V70.2
	C150,66,146.6,62.5,142.3,62.5L142.3,62.5z M104,121.7c-1.3,0-2.6,0.3-3.7,0.9c-0.9,0.4-1.8,0.8-2.8,1.2v-12.2
	c0-1.5-1.2-2.7-2.7-2.7h-2.1c-1.5,0-2.7,1.2-2.7,2.7v30.7l-0.2,0.2H70.2l-0.2-0.2v-9.8c0-0.3,0-0.6-0.1-0.9c0-0.1,0-0.3,0-0.4v-19.6
	c0-1.5-1.2-2.7-2.7-2.7h-2.1c-1.5,0-2.7,1.2-2.7,2.7v12.2c-0.9-0.4-1.8-0.8-2.7-1.2c-1.2-0.6-2.5-0.9-3.8-0.9
	c-1.6,0-3.2,0.5-4.6,1.3V102c0-1.9,1.6-3.5,3.5-3.5H105c1.9,0,3.5,1.6,3.5,3.5v21.1C107.2,122.2,105.7,121.8,104,121.7L104,121.7z
	 M64.2,71.8c0-8.9,7.2-16.1,16.1-16.1S96.3,63,96.3,71.8s-7.2,16.1-16.1,16.1S64.2,80.7,64.2,71.8z M142.5,89.8l-0.2,0.2h-9.8
	c-3.6,0-6.9,2.3-8.1,5.8c-0.5,1.5-1.2,3.1-1.9,4.5c-1.6,3.3-0.9,7.2,1.6,9.8l0.1,0.1l6.9,6.9l0.1,0.1l-0.1,0.1l-13.9,13.9l-0.1,0.1
	l-0.1-0.1l-0.9-0.9V102c0-6.1-4.9-11-11-11h-11c5.9-4.3,9.8-11.2,9.8-19.1c0-13-10.6-23.6-23.6-23.6S56.7,58.8,56.7,71.8
	c0,7.8,3.8,14.8,9.8,19.1H55c-6.1,0-11,4.9-11,11v28.3l-0.9,0.9l-0.1,0.1l-0.1-0.1l-13.9-13.9l0-0.1l0-0.1l6.9-6.9l0,0
	c2.5-2.6,3.2-6.5,1.6-9.8c-0.7-1.5-1.3-3-1.9-4.5c-1.2-3.4-4.4-5.8-8-5.8h-9.8l-0.2-0.2V70.2l0.2-0.2h9.8c3.6,0,6.9-2.3,8-5.8
	c0.5-1.5,1.2-3,1.9-4.5c1.6-3.3,1-7.2-1.6-9.8l0,0L28.9,43v-0.2l13.9-13.9l0.1,0l0.1,0l6.9,6.9l0,0c1.6,1.6,3.8,2.5,6,2.5
	c1.3,0,2.6-0.3,3.8-0.9c1.5-0.7,3-1.3,4.5-1.9c3.4-1.2,5.8-4.4,5.8-8v-9.8l0.2-0.2h19.7l0.2,0.2v9.8c0,3.6,2.3,6.9,5.8,8.1
	c1.5,0.5,3.1,1.2,4.5,1.9c1.2,0.6,2.5,0.9,3.8,0.9c2.3,0,4.4-0.9,6-2.5l0.1,0l6.9-6.9l0.1,0l0.1,0l13.9,13.9V43l-6.9,6.9l0,0
	c-2.6,2.6-3.2,6.5-1.6,9.8c0.7,1.5,1.3,3,1.9,4.5c1.2,3.4,4.4,5.8,8.1,5.8h9.8l0.2,0.2L142.5,89.8L142.5,89.8z"
        />
      </svg>
    );
  }
);
