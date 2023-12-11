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
        xmlSpace="preserve"
        {...props}
      >
        <g>
          <polygon
            fill={color === 'white' ? '#ffffff' : '#0d1b40'}
            points="268.4,112.8 271.1,112.8 269.7,109 	"
          />
          <path
            fill={color === 'white' ? '#ffffff' : '#0d1b40'}
            d="M309.6,108.9c-1.6,0-2.5,1.2-2.5,2.7s1,2.7,2.5,2.7s2.5-1.2,2.5-2.7S311.1,108.9,309.6,108.9z"
          />
          <path
            fill={color === 'white' ? '#ffffff' : '#0d1b40'}
            d="M322.7,109h-1.5v5.1h1.5c1.6,0,2.6-1.2,2.6-2.6S324.4,109,322.7,109L322.7,109z"
          />
          <path
            fill={color === 'white' ? '#ffffff' : '#0d1b40'}
            d="M349.6,103H219.8c-0.4,0-0.7,0.3-0.7,0.7v14.9c0,0.4,0.3,0.7,0.7,0.7h129.8c0.4,0,0.7-0.3,0.7-0.7v-14.9
		C350.3,103.3,350,103,349.6,103z M234.6,116.3h-3.9v-9.3h3.9c2.9,0,5.1,1.8,5.1,4.7S237.5,116.3,234.6,116.3z M249.9,116.3
		l-0.5-1.4h-3.9l-0.5,1.4h-2.6l3.5-9.3h3l3.5,9.3L249.9,116.3L249.9,116.3z M262.4,109h-2.6v7.2h-2.4V109h-2.6v-2.1h7.6L262.4,109
		L262.4,109z M272.1,116.3l-0.5-1.4h-3.9l-0.5,1.4h-2.6l3.5-9.3h3l3.5,9.3L272.1,116.3L272.1,116.3z M300.3,116.3H298l-4-5.6v5.6
		h-2.4v-9.3h2.5l3.8,5.4v-5.4h2.4L300.3,116.3L300.3,116.3z M309.5,116.4c-2.9,0-5-2-5-4.8s2.1-4.8,5-4.8s5,2,5,4.8
		S312.4,116.4,309.5,116.4z M322.7,116.3h-3.9v-9.3h3.9c2.9,0,5.1,1.8,5.1,4.7S325.6,116.3,322.7,116.3z M338.8,108.9h-4.4v1.6h4.3
		v2h-4.3v1.7h4.4v2h-6.9v-9.3h6.9V108.9L338.8,108.9z"
          />
          <polygon
            fill={color === 'white' ? '#ffffff' : '#0d1b40'}
            points="246.1,112.8 248.8,112.8 247.4,109 	"
          />
          <path
            fill={color === 'white' ? '#ffffff' : '#0d1b40'}
            d="M234.6,109h-1.5v5.1h1.5c1.6,0,2.6-1.2,2.6-2.6S236.3,109,234.6,109L234.6,109z"
          />
        </g>
      </svg >
    );
  }
);
