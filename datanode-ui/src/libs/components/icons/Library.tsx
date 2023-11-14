import { useTheme } from '@mui/material';
import React from 'react';

export const Library: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    const theme = useTheme();
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
          fill={plain ? 'transparent' : '#F0F8FE'}
          d="M144,73.6h-25.2v10.3c0,5.4-4.4,9.8-9.8,9.8H51c-5.4,0-9.8-4.4-9.8-9.8V73.6H16c-1.2,0-2.2,1-2.2,2.3V144
	c0,1.2,1,2.3,2.2,2.3h128c1.2,0,2.2-1,2.2-2.3V75.8C146.2,74.6,145.2,73.6,144,73.6z M102.9,131H58v-21.1h44.9
	C102.9,109.9,102.9,131,102.9,131z"
        />
        <path
          fill={plain ? 'evenodd' : theme.palette.primary.main}
          d="M98.9,112.3v15.2H61.1v-15.2H98.9 M106.4,104.8H53.6V129c0,3.3,2.7,6,6,6h40.8c3.3,0,6-2.7,6-6V104.8z"
        />
        <g>
          <path
            fill={plain ? 'evenodd' : theme.palette.primary.main}
            d="M104.6,17.6H48.1c-3.3,0-6,2.7-6,6v6.6h7.5v-5.1h53.5v5.1h7.5v-6.6C110.6,20.3,107.9,17.6,104.6,17.6z"
          />
          <path
            fill={plain ? 'evenodd' : theme.palette.primary.main}
            d="M149.7,73.8l-26.6-61.5c-0.8-1.9-3-2.8-4.9-1.9s-2.8,3-1.9,4.9l23.6,54.5H115v14.1c0,3.3-2.7,6-6,6H51
		c-3.3,0-6-2.7-6-6V69.8H20.2l23.6-54.5c0.8-1.9,0-4.1-2-4.9s-4.1,0.1-4.9,1.9L10.3,73.8c-0.2,0.5-0.3,1.1-0.3,1.7
		c0,0.1,0,0.2,0,0.4V144c0,3.3,2.7,6,6,6h128c3.3,0,6-2.7,6-6V75.8c0-0.1,0-0.2,0-0.4C150,74.9,149.9,74.3,149.7,73.8z M142.5,142.5
		h-125V77.3h20v6.5c0,7.5,6.1,13.5,13.5,13.5h58c7.4,0,13.5-6.1,13.5-13.5v-6.5h20V142.5z"
          />
          <path
            fill={plain ? 'evenodd' : theme.palette.primary.main}
            d="M116.1,35.2H44.2c-3.3,0-6,2.7-6,6v6h7.5v-4.5h68.8v4.5h7.5v-6C122.1,37.9,119.4,35.2,116.1,35.2z"
          />
          <path
            fill={plain ? 'evenodd' : theme.palette.primary.main}
            d="M129.7,64.8v-6.5c0-3.3-2.7-6-6-6H36.6c-3.3,0-6,2.7-6,6v6.5h7.5v-5h84.1v5H129.7z"
          />
        </g>
      </svg>
    );
  }
);
