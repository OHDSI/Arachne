import React from 'react';

export const LogoLarge = React.forwardRef<any, { color: 'primary' | 'white' }>(
  (props: { color: 'primary' | 'white' }, ref) => {
    const { color = 'primary' } = props;
    return (
      <svg
        ref={ref}
        version="1.1"
        id="close"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 357 119.3"
        // style={{ enableBackground: 'new 0 0 401 126' }}
        xmlSpace="preserve"
        {...props}
      >
        {/* <g>
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M89,60.3h16.7c7.5,0,11.6,5.1,11.6,11.1s-4.1,11-11.6,11h-8.1v11.3H89V60.3z M104.6,67.5h-7V75h7
		c2.3,0,4-1.4,4-3.7S106.9,67.5,104.6,67.5z"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M121.8,69.5h7.7v3.1c1.6-1.9,4.7-3.7,7.6-3.7v7.5c-0.4-0.2-1.1-0.2-1.9-0.2c-2,0-4.7,0.8-5.7,2.2v15.3h-7.7
		C121.8,93.6,121.8,69.5,121.8,69.5z"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M139.7,81.5c0-6.8,5-12.7,13.2-12.7s13.2,5.9,13.2,12.7s-4.9,12.7-13.2,12.7S139.7,88.3,139.7,81.5z
		 M158.2,81.5c0-3.2-1.9-5.9-5.3-5.9s-5.2,2.7-5.2,5.9s1.9,5.9,5.2,5.9S158.2,84.8,158.2,81.5z"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M200.9,76.7c0-3.4-1.4-5.5-4.9-5.5c-2.6,0-5.6,1.9-6.9,4.1v18.3h-2.6V76.7c0-3.4-1.4-5.5-4.9-5.5
		c-2.6,0-5.5,1.9-6.9,4.2v18.3h-2.6V69.5h2.6v3.7c1-1.6,4.3-4.2,7.8-4.2c3.8,0,5.8,2.2,6.4,4.6c1.4-2.2,4.6-4.6,8-4.6
		c4.5,0,6.6,2.5,6.6,7.4v17.4h-2.6L200.9,76.7L200.9,76.7z"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M222.6,68.9c7.4,0,11.4,5.9,11.4,12.8v0.7h-20.2c0.2,5.3,3.8,9.6,9.5,9.6c3.1,0,5.9-1.2,7.9-3.3l1.4,1.7
		c-2.4,2.5-5.5,3.9-9.5,3.9C216,94.3,211,89,211,81.5C211,74.5,215.9,68.9,222.6,68.9L222.6,68.9z M213.8,80.3h17.6
		c-0.1-4.1-2.8-9.2-8.8-9.2C216.9,71.1,214,76.1,213.8,80.3L213.8,80.3z"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M242,89V71.8h-4v-2.3h4v-6.6h2.6v6.6h4.9v2.3h-4.9v16.8c0,1.9,0.8,3.3,2.5,3.3c1.1,0,2.1-0.6,2.7-1.2l1,2
		c-0.9,0.9-2.1,1.5-4.1,1.5C243.6,94.2,242,92.3,242,89L242,89z"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M272.4,77.2c0-4.7-2.4-6-5.9-6c-3.1,0-6.3,1.9-7.9,4.2v18.3H256V60.3h2.6v12.9c1.8-2.1,5.2-4.2,8.7-4.2
		c4.9,0,7.6,2.3,7.6,7.8v17h-2.6V77.2L272.4,77.2z"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M294.1,68.9c7.4,0,11.4,5.9,11.4,12.8v0.7h-20.2c0.2,5.3,3.8,9.6,9.5,9.6c3,0,5.9-1.2,7.9-3.3l1.4,1.7
		c-2.4,2.5-5.5,3.9-9.5,3.9c-7.1,0-12.1-5.3-12.1-12.7C282.4,74.5,287.4,68.9,294.1,68.9L294.1,68.9z M285.3,80.3h17.6
		c0-4.1-2.8-9.2-8.8-9.2C288.3,71.1,285.5,76.1,285.3,80.3z"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M329.3,90.1c-2,2.2-5.2,4.2-8.7,4.2c-5,0-7.6-2.3-7.6-7.8v-17h2.6v16.4c0,4.7,2.4,6,5.9,6c3.1,0,6.3-1.8,7.9-4
		V69.5h2.6v24.2h-2.6V90.1L329.3,90.1z"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M340.2,88.5c1.5,1.9,4.4,3.6,7.8,3.6c4.1,0,6.5-2,6.5-4.8c0-3.1-3.3-4-6.8-4.9c-4-1-8.5-2.1-8.5-6.8
		c0-3.7,3.1-6.7,8.6-6.7c4.2,0,6.9,1.6,8.7,3.6l-1.5,1.8c-1.4-1.9-4-3.2-7.2-3.2c-3.8,0-6.1,1.8-6.1,4.4c0,2.8,3.1,3.5,6.5,4.4
		c4.2,1.1,8.8,2.2,8.8,7.4c0,3.9-3,7.1-9.1,7.1c-3.9,0-6.9-1.2-9.3-3.8L340.2,88.5L340.2,88.5z"
          />
        </g> */}
        {/* <path
          fill={color == 'white' ? '#ffffff' : '#0d1b40'}
          d="M87.3,40.8L87.3,40.8L87.3,40.8L87.3,40.8C82.8,26,69.2,16.6,52.8,16.6c-20,0-36.2,16.2-36.2,36.2
	c0,16.2,10.6,29.9,25.3,34.5c0.2,0.1,0.5,0.2,0.5,0.2c0,0,0.1,0,0.1,0c0.2,0,0.3-0.1,0.3-0.3c0-0.1-0.1-0.2-0.2-0.3
	c0,0-0.4-0.2-0.6-0.2c-13-5-22.2-17.6-22.2-32.3c0-19.1,15.5-34.6,34.6-34.6c14.4,0,26.7,7.6,31.9,20.1c0.2,0.4,0.5,1.3,0.5,1.3
	c0.1,0.1,0.1,0.2,0.2,0.2c0.2,0,0.3-0.1,0.3-0.3C87.4,41,87.3,40.9,87.3,40.8L87.3,40.8z"
        />
        <path
          fill={color == 'white' ? '#ffffff' : '#0d1b40'}
          d="M101.9,40.8L101.9,40.8C97.4,17,76.7,0,51.5,0C23.1,0,0,23.1,0,51.5c0,24.2,17.7,44.5,40.2,50
	c0.6,0.2,1.9,0.4,1.9,0.4c0,0,0,0,0.1,0c0.2,0,0.3-0.1,0.3-0.3c0-0.1-0.1-0.2-0.2-0.3c0,0-0.4-0.1-0.5-0.2
	C20.9,95.6,4.5,76.4,4.5,53.7c0-27.2,22.1-49.3,49.3-49.3c22.6,0,41.5,14.4,47.2,35.2c0.1,0.5,0.4,1.5,0.4,1.5
	c0,0.1,0.1,0.2,0.2,0.2c0.2,0,0.3-0.1,0.3-0.3C101.9,41,101.9,40.9,101.9,40.8L101.9,40.8z"
        />
        <path
          fill={color == 'white' ? '#ffffff' : '#0d1b40'}
          d="M52.6,71c0,0-7.3-4.2-6.9-8.2c1,1.1,1.5,1.3,2,1.4c-1.6-4.6-1.3-7.7,0.8-12s5.2-4.5,5.2-4.5s-0.2,3.2,0.8,5.4
	c1.1,2.3,4.2,3.8,4.2,3.8s-0.5-3.3,2.3-5.5c0.9,4.3,4.4,2.8,5.1,6.7c0.7,3.6-1.1,5.5-4.8,9.9c6.3-4.3,12.1-7.4,12.4-14.7
	c0.3-7.9-2.7-8.4-5.2-11.9c-2-2.8-1-5.2-1-5.2s-1.6-0.1-3,3.2c-1.3,3,0.5,5.6,0.5,5.6s-2.8-0.5-4.7-4.2s-0.2-9.2-0.2-9.2
	S53.9,37,50,42.1c-2.5,3.2-6.1,11.6-6.1,11.6s-1.1-2-0.8-5.1c-0.2,0.2-3.8,6.6-3.7,11.6C39.6,65.8,43.3,69.1,52.6,71L52.6,71z"
        /> */}
        {/* <g>
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M62,88.5c0.1,0.1,0.2,0.3,0.3,0.4l11.3-5c0-0.2-0.1-0.3-0.1-0.4l-1.4-10.4c-0.5-1.9-2.4-3-3.9-2.3L56.2,76
		c-1.5,0.7-2,2.8-0.9,4.5C55.3,80.5,62,88.5,62,88.5z"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M65.8,94c0.3,0.5,0.6,1,0.8,1.5l11.8,22.1c1.1,1.7,2.7,2.1,3.9,1.5s2.1-2,1.5-3.9l-8.4-23.6
		c-0.2-0.6-0.4-1.1-0.5-1.7L65.8,94L65.8,94z"
          />
        </g> */}

        {/* <g>
          <path fill={'#5B5A56'} d="M102.52 20.98l-0.17 -1.58c-1.76,0.2 -4.05,0.64 -6.98,-0.61 -1.76,-0.82 -3.26,-2.43 -3.02,-5.12 0.21,-2.33 1.9,-3.9 3.26,-4.83 2.19,-1.49 3.59,-1.83 5.91,-2.18l-0.2 -1.78c-2.43,0.11 -10.16,2.69 -11.09,8.68 -0.33,2.19 0.45,3.83 1.78,5.11 0.94,0.91 2.03,1.59 3.5,2 2.07,0.57 4.69,0.55 7,0.32zm42.07 -14.43l5.13 -0.06 -0.06 -1.72 -7.07 0.4 0.05 15.67 7.55 0.18 -0.14 -1.83 -5.38 0.05 0.06 -5.5 4.32 0.04 -0.03 -1.67 -4.37 0.18 -0.05 -5.75zm-72.69 13.58l1.68 1.03 2.56 -5.44 7.82 -0.27 3.02 5.67 1.87 -1.11 -8.75 -15.68 -8.2 15.81zm5 -5.84l3.14 -6.64 3.27 6.39 -6.41 0.25zm-16.73 -7.54c2.25,-0.15 4.95,0.43 4.93,2.59 -0.09,2.37 -2.37,3.48 -3.2,4.04l5.88 7.79 1.6 -1.3 -5.04 -6.41c0.79,-0.78 2.84,-2.36 2.97,-4.25 0.05,-0.73 -0.08,-1.6 -0.85,-2.37 -1.62,-1.61 -5.47,-1.81 -8.38,-1.71l0.06 15.68 2.14 -0.1 -0.12 -13.01 0 -0.98zm59.67 -1.58l-2.22 0 0.01 6.7 -9.93 0.4 0 -7.12 -2.05 -0.01 0.02 15.69 2.11 -0.04 -0.05 -7.01 9.95 -0.4 -0.04 7.46 2.05 -0 0.15 -15.67zm3.89 15.66l2.01 0.05 0.15 -12.14 12.41 12.46 0.6 -16.02 -2.02 -0.01 -0.17 11.63 -12.15 -12.48 -0.83 16.51zm-85.21 -0.7l1.68 1.03 2.56 -5.44 7.82 -0.27 3.02 5.67 1.87 -1.11 -8.75 -15.68 -8.2 15.81zm5 -5.84l3.14 -6.64 3.27 6.39 -6.41 0.25z" />
        </g> */}

        <g>
          <path fill="#ffffff" d="M20.8 5.02c0.2,0.39 0.36,0.8 0.48,1.25 -0.38,0.27 -0.75,0.57 -1.1,0.92 -1.87,1.87 -2.58,4.37 -1.99,6.35 -0.29,0.08 -0.6,0.13 -0.91,0.13 -0.31,0 -0.6,-0.04 -0.89,-0.12 0.59,-1.97 -0.11,-4.47 -1.97,-6.34 -0.36,-0.36 -0.74,-0.68 -1.14,-0.95 0.12,-0.45 0.29,-0.88 0.49,-1.26 -0.29,-0.04 -0.57,-0.1 -0.85,-0.18 -0.15,0.31 -0.28,0.64 -0.38,0.99 -0.3,-0.16 -0.6,-0.29 -0.91,-0.41 -0.14,0.26 -0.31,0.5 -0.49,0.72 0.4,0.13 0.8,0.31 1.19,0.53 -0.09,0.47 -0.13,0.96 -0.13,1.46 0,2.65 1.27,4.92 3.09,5.89 -0.15,0.26 -0.33,0.51 -0.55,0.73 -0.22,0.22 -0.46,0.4 -0.73,0.55 -0.98,-1.81 -3.24,-3.08 -5.88,-3.09 -0.5,-0 -0.98,0.04 -1.44,0.13 -0.24,-0.41 -0.42,-0.83 -0.56,-1.26 -0.23,0.18 -0.47,0.34 -0.73,0.48 0.12,0.33 0.26,0.66 0.43,0.98 -0.34,0.1 -0.67,0.23 -0.97,0.37 0.08,0.28 0.13,0.57 0.16,0.86 0.39,-0.2 0.82,-0.36 1.27,-0.48 0.27,0.39 0.57,0.76 0.92,1.1 1.86,1.87 4.37,2.59 6.34,2 0.08,0.29 0.13,0.6 0.13,0.91 -0,0.31 -0.05,0.61 -0.13,0.9 -1.97,-0.59 -4.47,0.12 -6.34,1.98 -0.35,0.35 -0.66,0.72 -0.93,1.11 -0.46,-0.12 -0.9,-0.29 -1.29,-0.5 -0.04,0.29 -0.1,0.57 -0.18,0.85 0.32,0.15 0.66,0.29 1.02,0.4 -0.16,0.29 -0.29,0.59 -0.4,0.89 0.26,0.15 0.5,0.31 0.72,0.5 0.13,-0.4 0.31,-0.8 0.54,-1.18 0.46,0.08 0.94,0.13 1.43,0.13 2.64,0.01 4.92,-1.26 5.9,-3.07 0.27,0.15 0.51,0.33 0.74,0.55 0.22,0.22 0.4,0.46 0.55,0.73 -1.81,0.98 -3.08,3.24 -3.08,5.88 -0,0.5 0.04,0.98 0.13,1.44 -0.41,0.24 -0.84,0.43 -1.27,0.56 0.17,0.23 0.33,0.48 0.47,0.73 0.34,-0.12 0.67,-0.26 1,-0.44 0.1,0.33 0.22,0.64 0.36,0.94 0.28,-0.08 0.57,-0.13 0.86,-0.16 -0.19,-0.38 -0.35,-0.8 -0.47,-1.24 0.38,-0.27 0.76,-0.57 1.1,-0.92 1.87,-1.87 2.58,-4.37 2,-6.34 0.29,-0.08 0.6,-0.13 0.91,-0.13 0.31,0 0.61,0.04 0.9,0.13 -0.58,1.97 0.12,4.47 1.98,6.33 0.35,0.35 0.72,0.66 1.11,0.93 -0.12,0.46 -0.29,0.89 -0.5,1.29 0.29,0.04 0.57,0.1 0.85,0.19 0.16,-0.32 0.29,-0.66 0.4,-1.02 0.29,0.16 0.59,0.29 0.89,0.4 0.15,-0.26 0.31,-0.5 0.5,-0.72 -0.4,-0.13 -0.79,-0.31 -1.18,-0.53 0.08,-0.46 0.13,-0.94 0.13,-1.43 0,-2.64 -1.26,-4.91 -3.08,-5.9 0.15,-0.27 0.33,-0.51 0.55,-0.74 0.22,-0.22 0.46,-0.4 0.73,-0.55 0.98,1.81 3.24,3.07 5.88,3.08 0.5,0 0.98,-0.04 1.44,-0.13 0.23,0.4 0.41,0.81 0.55,1.22 0.23,-0.18 0.47,-0.33 0.73,-0.48 -0.11,-0.32 -0.25,-0.63 -0.42,-0.94 0.33,-0.1 0.65,-0.22 0.95,-0.36 -0.08,-0.28 -0.14,-0.57 -0.17,-0.86 -0.38,0.19 -0.8,0.35 -1.24,0.47 -0.27,-0.38 -0.57,-0.75 -0.92,-1.1 -1.87,-1.87 -4.37,-2.58 -6.35,-1.99 -0.08,-0.29 -0.13,-0.6 -0.13,-0.91 0,-0.31 0.04,-0.61 0.13,-0.9 1.97,0.58 4.47,-0.12 6.33,-1.99 0.35,-0.35 0.66,-0.72 0.93,-1.11 0.46,0.12 0.9,0.29 1.29,0.5 0.03,-0.29 0.1,-0.57 0.17,-0.86 -0.32,-0.15 -0.66,-0.28 -1.01,-0.39 0.16,-0.31 0.3,-0.62 0.42,-0.94 -0.26,-0.15 -0.5,-0.31 -0.72,-0.5 -0.13,0.41 -0.32,0.83 -0.55,1.23 -0.46,-0.08 -0.94,-0.13 -1.43,-0.13 -2.64,-0 -4.91,1.27 -5.89,3.08 -0.27,-0.15 -0.52,-0.33 -0.74,-0.55 -0.22,-0.22 -0.4,-0.46 -0.55,-0.73 1.81,-0.98 3.07,-3.25 3.07,-5.88 0,-0.5 -0.04,-0.98 -0.13,-1.44 0.41,-0.24 0.84,-0.43 1.27,-0.56 -0.18,-0.23 -0.34,-0.47 -0.48,-0.73 -0.34,0.12 -0.67,0.26 -0.99,0.44 -0.1,-0.33 -0.22,-0.65 -0.36,-0.95 -0.28,0.08 -0.57,0.13 -0.86,0.16zm-5.2 8.2c-1.51,-0.85 -2.56,-2.82 -2.56,-5.11 0,-0.32 0.02,-0.64 0.06,-0.94 0.25,0.19 0.49,0.4 0.72,0.63 1.61,1.62 2.25,3.75 1.79,5.42zm-2.39 2.38c-1.67,0.45 -3.8,-0.2 -5.41,-1.82 -0.22,-0.22 -0.42,-0.45 -0.6,-0.68 0.3,-0.04 0.61,-0.06 0.92,-0.06 2.28,0.01 4.24,1.06 5.09,2.56zm-5.83 -10.12c0.76,-0.37 1.63,-0.52 2.53,-0.45 -0.61,0.64 -1.6,0.92 -2.52,0.8 -0,-0.12 -0,-0.23 -0,-0.34zm6.52 -2.15c0.58,-0.65 1.27,-1.13 2.04,-1.39 0.08,0.09 0.16,0.19 0.23,0.29 -0.48,0.84 -1.37,1.17 -2.27,1.1zm4.72 -1.39c0.79,0.27 1.51,0.78 2.09,1.45 -0.87,0.01 -1.76,-0.48 -2.32,-1.23 0.08,-0.08 0.15,-0.16 0.22,-0.23zm6.16 3.09c0.86,-0.05 1.68,0.1 2.41,0.45 -0.01,0.12 -0.02,0.24 -0.04,0.36 -0.93,0.25 -1.78,-0.14 -2.37,-0.81zm4.32 2.35c0.37,0.75 0.52,1.61 0.46,2.51 -0.62,-0.61 -0.9,-1.59 -0.77,-2.5 0.11,-0 0.21,-0 0.31,-0zm2.17 6.54c0.64,0.57 1.12,1.26 1.38,2.01 -0.09,0.08 -0.18,0.16 -0.28,0.22 -0.83,-0.48 -1.16,-1.35 -1.1,-2.23zm1.4 4.7c-0.27,0.8 -0.78,1.52 -1.46,2.11 -0.02,-0.88 0.48,-1.77 1.23,-2.34 0.08,0.08 0.16,0.15 0.23,0.23zm-3.1 6.14c0.05,0.85 -0.09,1.67 -0.42,2.39 -0.12,-0.01 -0.24,-0.02 -0.35,-0.04 -0.25,-0.91 0.12,-1.76 0.78,-2.35zm-2.36 4.36c-0.75,0.37 -1.62,0.51 -2.51,0.44 0.61,-0.63 1.59,-0.9 2.51,-0.77 0,0.11 0,0.22 0,0.33zm-6.53 2.16c-0.58,0.65 -1.29,1.14 -2.06,1.4 -0.09,-0.1 -0.18,-0.21 -0.25,-0.31 0.5,-0.85 1.41,-1.17 2.32,-1.08zm-4.67 1.4c-0.81,-0.27 -1.54,-0.78 -2.14,-1.48 0.9,-0.04 1.82,0.46 2.4,1.22 -0.09,0.09 -0.17,0.18 -0.25,0.26zm-6.19 -3.11c-0.88,0.05 -1.72,-0.1 -2.45,-0.47 0.01,-0.14 0.02,-0.27 0.04,-0.41 0.95,-0.25 1.83,0.17 2.41,0.88zm-4.35 -2.41c-0.36,-0.75 -0.49,-1.62 -0.42,-2.51 0.62,0.62 0.89,1.59 0.76,2.51 -0.12,0 -0.23,0 -0.34,0zm-2.13 -6.49c-0.65,-0.59 -1.14,-1.29 -1.4,-2.07 0.1,-0.09 0.21,-0.18 0.32,-0.26 0.85,0.5 1.17,1.41 1.08,2.33zm-1.38 -4.75c0.28,-0.79 0.79,-1.5 1.47,-2.08 0.01,0.88 -0.49,1.76 -1.23,2.32 -0.08,-0.08 -0.16,-0.16 -0.24,-0.24zm3.09 -6.09c-0.05,-0.86 0.09,-1.68 0.44,-2.41 0.13,0.01 0.25,0.02 0.37,0.04 0.25,0.93 -0.14,1.78 -0.81,2.37zm11.03 4.52c-0.19,0.36 -0.44,0.7 -0.74,1 -0.3,0.3 -0.63,0.54 -0.99,0.73 0.12,0.4 0.19,0.81 0.19,1.23 -0,0.42 -0.07,0.83 -0.19,1.22 0.37,0.19 0.7,0.44 1,0.74 0.3,0.3 0.54,0.63 0.73,0.99 0.4,-0.12 0.81,-0.19 1.23,-0.19 0.42,0 0.83,0.07 1.22,0.19 0.19,-0.37 0.44,-0.7 0.74,-1.01 0.3,-0.3 0.63,-0.54 0.99,-0.73 -0.12,-0.39 -0.19,-0.81 -0.19,-1.23 0,-0.42 0.06,-0.83 0.19,-1.22 -0.37,-0.19 -0.71,-0.44 -1.01,-0.74 -0.3,-0.3 -0.54,-0.63 -0.73,-0.99 -0.39,0.12 -0.81,0.19 -1.23,0.19 -0.42,0 -0.82,-0.06 -1.21,-0.18zm-2.85 4.64c-0.86,1.5 -2.82,2.55 -5.11,2.54 -0.31,-0 -0.61,-0.02 -0.91,-0.06 0.19,-0.24 0.39,-0.47 0.61,-0.69 1.61,-1.61 3.74,-2.25 5.41,-1.79zm2.39 2.39c0.46,1.67 -0.19,3.8 -1.81,5.41 -0.22,0.22 -0.45,0.42 -0.68,0.6 -0.04,-0.3 -0.06,-0.61 -0.06,-0.92 0,-2.28 1.05,-4.24 2.55,-5.09zm3.38 -0c1.5,0.86 2.55,2.82 2.55,5.11 -0,0.31 -0.02,0.61 -0.06,0.91 -0.24,-0.19 -0.47,-0.39 -0.69,-0.61 -1.61,-1.61 -2.25,-3.74 -1.8,-5.4zm2.39 -2.39c1.67,-0.46 3.8,0.19 5.41,1.81 0.22,0.22 0.42,0.45 0.6,0.68 -0.3,0.04 -0.61,0.06 -0.92,0.06 -2.28,-0 -4.24,-1.05 -5.09,-2.55zm-0 -3.38c0.86,-1.5 2.82,-2.55 5.1,-2.55 0.31,0 0.61,0.02 0.91,0.06 -0.18,0.24 -0.39,0.47 -0.61,0.69 -1.61,1.61 -3.74,2.26 -5.4,1.8zm0.09 -8.4c0.04,0.3 0.06,0.61 0.06,0.92 0,2.28 -1.05,4.24 -2.54,5.1 -0.46,-1.67 0.19,-3.8 1.8,-5.41 0.22,-0.22 0.45,-0.42 0.68,-0.6z" />
        </g>

        <g>
          <polygon
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            points="268.4,112.8 271.1,112.8 269.7,109 	"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M309.6,108.9c-1.6,0-2.5,1.2-2.5,2.7s1,2.7,2.5,2.7s2.5-1.2,2.5-2.7S311.1,108.9,309.6,108.9z"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M322.7,109h-1.5v5.1h1.5c1.6,0,2.6-1.2,2.6-2.6S324.4,109,322.7,109L322.7,109z"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M349.6,103H219.8c-0.4,0-0.7,0.3-0.7,0.7v14.9c0,0.4,0.3,0.7,0.7,0.7h129.8c0.4,0,0.7-0.3,0.7-0.7v-14.9
		C350.3,103.3,350,103,349.6,103z M234.6,116.3h-3.9v-9.3h3.9c2.9,0,5.1,1.8,5.1,4.7S237.5,116.3,234.6,116.3z M249.9,116.3
		l-0.5-1.4h-3.9l-0.5,1.4h-2.6l3.5-9.3h3l3.5,9.3L249.9,116.3L249.9,116.3z M262.4,109h-2.6v7.2h-2.4V109h-2.6v-2.1h7.6L262.4,109
		L262.4,109z M272.1,116.3l-0.5-1.4h-3.9l-0.5,1.4h-2.6l3.5-9.3h3l3.5,9.3L272.1,116.3L272.1,116.3z M300.3,116.3H298l-4-5.6v5.6
		h-2.4v-9.3h2.5l3.8,5.4v-5.4h2.4L300.3,116.3L300.3,116.3z M309.5,116.4c-2.9,0-5-2-5-4.8s2.1-4.8,5-4.8s5,2,5,4.8
		S312.4,116.4,309.5,116.4z M322.7,116.3h-3.9v-9.3h3.9c2.9,0,5.1,1.8,5.1,4.7S325.6,116.3,322.7,116.3z M338.8,108.9h-4.4v1.6h4.3
		v2h-4.3v1.7h4.4v2h-6.9v-9.3h6.9V108.9L338.8,108.9z"
          />
          <polygon
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            points="246.1,112.8 248.8,112.8 247.4,109 	"
          />
          <path
            fill={color == 'white' ? '#ffffff' : '#0d1b40'}
            d="M234.6,109h-1.5v5.1h1.5c1.6,0,2.6-1.2,2.6-2.6S236.3,109,234.6,109L234.6,109z"
          />
        </g>
      </svg >
    );
  }
);
