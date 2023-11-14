import { useTheme } from '@mui/material';
import React from 'react';

export const VocabularySelected: React.FC<any> = React.forwardRef(
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
        <circle fill="#8dc9f7" cx="66.3" cy="68.2" r="56.3" />
        <path
          fill={theme.palette.primary.main || '#A9BAD4'}
          d="M152.8,145.2l-39.4-39.4c20.8-26,16.6-64-9.5-84.8s-64-16.6-84.8,9.5s-16.6,64,9.5,84.8
	c23.6,18.9,57.6,17.3,79.4-3.6l39.2,39.2c1.6,1.6,4.1,1.6,5.7,0S154.4,146.8,152.8,145.2z M66.3,120.5C37.4,120.5,14,97.1,14,68.2
	c0-28.9,23.4-52.3,52.3-52.3c28.9,0,52.3,23.4,52.3,52.3c0,13.9-5.5,27.2-15.3,37C93.5,115,80.2,120.5,66.3,120.5z"
        />
        <path
          fill={theme.palette.primary.main || '#A9BAD4'}
          d="M66.3,34.2c18.8,0,34,15.2,34,34c0,2.2,1.8,4,4,4s4-1.8,4-4c0-23.2-18.8-42-42-42c-2.2,0-4,1.8-4,4
	S64.1,34.2,66.3,34.2z"
        />
      </svg>
    );
  }
);
