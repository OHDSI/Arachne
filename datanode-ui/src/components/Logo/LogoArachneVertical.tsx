import React, { FC } from 'react';

export const LogoArachne: FC<any> = props => {
    const { fullSize = true } = props;

    return (
        <svg
            height="100%"
            strokeMiterlimit="10"
            style={{
                clipRule: 'evenodd',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
            }}
            version="1.1"
            viewBox="0 0 30 30"
            width="100%"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <g transform="translate(0, 0)">
                <path fill="#00B3C2" d="M20.8 5.02c0.2,0.39 0.36,0.8 0.48,1.25 -0.38,0.27 -0.75,0.57 -1.1,0.92 -1.87,1.87 -2.58,4.37 -1.99,6.35 -0.29,0.08 -0.6,0.13 -0.91,0.13 -0.31,0 -0.6,-0.04 -0.89,-0.12 0.59,-1.97 -0.11,-4.47 -1.97,-6.34 -0.36,-0.36 -0.74,-0.68 -1.14,-0.95 0.12,-0.45 0.29,-0.88 0.49,-1.26 -0.29,-0.04 -0.57,-0.1 -0.85,-0.18 -0.15,0.31 -0.28,0.64 -0.38,0.99 -0.3,-0.16 -0.6,-0.29 -0.91,-0.41 -0.14,0.26 -0.31,0.5 -0.49,0.72 0.4,0.13 0.8,0.31 1.19,0.53 -0.09,0.47 -0.13,0.96 -0.13,1.46 0,2.65 1.27,4.92 3.09,5.89 -0.15,0.26 -0.33,0.51 -0.55,0.73 -0.22,0.22 -0.46,0.4 -0.73,0.55 -0.98,-1.81 -3.24,-3.08 -5.88,-3.09 -0.5,-0 -0.98,0.04 -1.44,0.13 -0.24,-0.41 -0.42,-0.83 -0.56,-1.26 -0.23,0.18 -0.47,0.34 -0.73,0.48 0.12,0.33 0.26,0.66 0.43,0.98 -0.34,0.1 -0.67,0.23 -0.97,0.37 0.08,0.28 0.13,0.57 0.16,0.86 0.39,-0.2 0.82,-0.36 1.27,-0.48 0.27,0.39 0.57,0.76 0.92,1.1 1.86,1.87 4.37,2.59 6.34,2 0.08,0.29 0.13,0.6 0.13,0.91 -0,0.31 -0.05,0.61 -0.13,0.9 -1.97,-0.59 -4.47,0.12 -6.34,1.98 -0.35,0.35 -0.66,0.72 -0.93,1.11 -0.46,-0.12 -0.9,-0.29 -1.29,-0.5 -0.04,0.29 -0.1,0.57 -0.18,0.85 0.32,0.15 0.66,0.29 1.02,0.4 -0.16,0.29 -0.29,0.59 -0.4,0.89 0.26,0.15 0.5,0.31 0.72,0.5 0.13,-0.4 0.31,-0.8 0.54,-1.18 0.46,0.08 0.94,0.13 1.43,0.13 2.64,0.01 4.92,-1.26 5.9,-3.07 0.27,0.15 0.51,0.33 0.74,0.55 0.22,0.22 0.4,0.46 0.55,0.73 -1.81,0.98 -3.08,3.24 -3.08,5.88 -0,0.5 0.04,0.98 0.13,1.44 -0.41,0.24 -0.84,0.43 -1.27,0.56 0.17,0.23 0.33,0.48 0.47,0.73 0.34,-0.12 0.67,-0.26 1,-0.44 0.1,0.33 0.22,0.64 0.36,0.94 0.28,-0.08 0.57,-0.13 0.86,-0.16 -0.19,-0.38 -0.35,-0.8 -0.47,-1.24 0.38,-0.27 0.76,-0.57 1.1,-0.92 1.87,-1.87 2.58,-4.37 2,-6.34 0.29,-0.08 0.6,-0.13 0.91,-0.13 0.31,0 0.61,0.04 0.9,0.13 -0.58,1.97 0.12,4.47 1.98,6.33 0.35,0.35 0.72,0.66 1.11,0.93 -0.12,0.46 -0.29,0.89 -0.5,1.29 0.29,0.04 0.57,0.1 0.85,0.19 0.16,-0.32 0.29,-0.66 0.4,-1.02 0.29,0.16 0.59,0.29 0.89,0.4 0.15,-0.26 0.31,-0.5 0.5,-0.72 -0.4,-0.13 -0.79,-0.31 -1.18,-0.53 0.08,-0.46 0.13,-0.94 0.13,-1.43 0,-2.64 -1.26,-4.91 -3.08,-5.9 0.15,-0.27 0.33,-0.51 0.55,-0.74 0.22,-0.22 0.46,-0.4 0.73,-0.55 0.98,1.81 3.24,3.07 5.88,3.08 0.5,0 0.98,-0.04 1.44,-0.13 0.23,0.4 0.41,0.81 0.55,1.22 0.23,-0.18 0.47,-0.33 0.73,-0.48 -0.11,-0.32 -0.25,-0.63 -0.42,-0.94 0.33,-0.1 0.65,-0.22 0.95,-0.36 -0.08,-0.28 -0.14,-0.57 -0.17,-0.86 -0.38,0.19 -0.8,0.35 -1.24,0.47 -0.27,-0.38 -0.57,-0.75 -0.92,-1.1 -1.87,-1.87 -4.37,-2.58 -6.35,-1.99 -0.08,-0.29 -0.13,-0.6 -0.13,-0.91 0,-0.31 0.04,-0.61 0.13,-0.9 1.97,0.58 4.47,-0.12 6.33,-1.99 0.35,-0.35 0.66,-0.72 0.93,-1.11 0.46,0.12 0.9,0.29 1.29,0.5 0.03,-0.29 0.1,-0.57 0.17,-0.86 -0.32,-0.15 -0.66,-0.28 -1.01,-0.39 0.16,-0.31 0.3,-0.62 0.42,-0.94 -0.26,-0.15 -0.5,-0.31 -0.72,-0.5 -0.13,0.41 -0.32,0.83 -0.55,1.23 -0.46,-0.08 -0.94,-0.13 -1.43,-0.13 -2.64,-0 -4.91,1.27 -5.89,3.08 -0.27,-0.15 -0.52,-0.33 -0.74,-0.55 -0.22,-0.22 -0.4,-0.46 -0.55,-0.73 1.81,-0.98 3.07,-3.25 3.07,-5.88 0,-0.5 -0.04,-0.98 -0.13,-1.44 0.41,-0.24 0.84,-0.43 1.27,-0.56 -0.18,-0.23 -0.34,-0.47 -0.48,-0.73 -0.34,0.12 -0.67,0.26 -0.99,0.44 -0.1,-0.33 -0.22,-0.65 -0.36,-0.95 -0.28,0.08 -0.57,0.13 -0.86,0.16zm-5.2 8.2c-1.51,-0.85 -2.56,-2.82 -2.56,-5.11 0,-0.32 0.02,-0.64 0.06,-0.94 0.25,0.19 0.49,0.4 0.72,0.63 1.61,1.62 2.25,3.75 1.79,5.42zm-2.39 2.38c-1.67,0.45 -3.8,-0.2 -5.41,-1.82 -0.22,-0.22 -0.42,-0.45 -0.6,-0.68 0.3,-0.04 0.61,-0.06 0.92,-0.06 2.28,0.01 4.24,1.06 5.09,2.56zm-5.83 -10.12c0.76,-0.37 1.63,-0.52 2.53,-0.45 -0.61,0.64 -1.6,0.92 -2.52,0.8 -0,-0.12 -0,-0.23 -0,-0.34zm6.52 -2.15c0.58,-0.65 1.27,-1.13 2.04,-1.39 0.08,0.09 0.16,0.19 0.23,0.29 -0.48,0.84 -1.37,1.17 -2.27,1.1zm4.72 -1.39c0.79,0.27 1.51,0.78 2.09,1.45 -0.87,0.01 -1.76,-0.48 -2.32,-1.23 0.08,-0.08 0.15,-0.16 0.22,-0.23zm6.16 3.09c0.86,-0.05 1.68,0.1 2.41,0.45 -0.01,0.12 -0.02,0.24 -0.04,0.36 -0.93,0.25 -1.78,-0.14 -2.37,-0.81zm4.32 2.35c0.37,0.75 0.52,1.61 0.46,2.51 -0.62,-0.61 -0.9,-1.59 -0.77,-2.5 0.11,-0 0.21,-0 0.31,-0zm2.17 6.54c0.64,0.57 1.12,1.26 1.38,2.01 -0.09,0.08 -0.18,0.16 -0.28,0.22 -0.83,-0.48 -1.16,-1.35 -1.1,-2.23zm1.4 4.7c-0.27,0.8 -0.78,1.52 -1.46,2.11 -0.02,-0.88 0.48,-1.77 1.23,-2.34 0.08,0.08 0.16,0.15 0.23,0.23zm-3.1 6.14c0.05,0.85 -0.09,1.67 -0.42,2.39 -0.12,-0.01 -0.24,-0.02 -0.35,-0.04 -0.25,-0.91 0.12,-1.76 0.78,-2.35zm-2.36 4.36c-0.75,0.37 -1.62,0.51 -2.51,0.44 0.61,-0.63 1.59,-0.9 2.51,-0.77 0,0.11 0,0.22 0,0.33zm-6.53 2.16c-0.58,0.65 -1.29,1.14 -2.06,1.4 -0.09,-0.1 -0.18,-0.21 -0.25,-0.31 0.5,-0.85 1.41,-1.17 2.32,-1.08zm-4.67 1.4c-0.81,-0.27 -1.54,-0.78 -2.14,-1.48 0.9,-0.04 1.82,0.46 2.4,1.22 -0.09,0.09 -0.17,0.18 -0.25,0.26zm-6.19 -3.11c-0.88,0.05 -1.72,-0.1 -2.45,-0.47 0.01,-0.14 0.02,-0.27 0.04,-0.41 0.95,-0.25 1.83,0.17 2.41,0.88zm-4.35 -2.41c-0.36,-0.75 -0.49,-1.62 -0.42,-2.51 0.62,0.62 0.89,1.59 0.76,2.51 -0.12,0 -0.23,0 -0.34,0zm-2.13 -6.49c-0.65,-0.59 -1.14,-1.29 -1.4,-2.07 0.1,-0.09 0.21,-0.18 0.32,-0.26 0.85,0.5 1.17,1.41 1.08,2.33zm-1.38 -4.75c0.28,-0.79 0.79,-1.5 1.47,-2.08 0.01,0.88 -0.49,1.76 -1.23,2.32 -0.08,-0.08 -0.16,-0.16 -0.24,-0.24zm3.09 -6.09c-0.05,-0.86 0.09,-1.68 0.44,-2.41 0.13,0.01 0.25,0.02 0.37,0.04 0.25,0.93 -0.14,1.78 -0.81,2.37zm11.03 4.52c-0.19,0.36 -0.44,0.7 -0.74,1 -0.3,0.3 -0.63,0.54 -0.99,0.73 0.12,0.4 0.19,0.81 0.19,1.23 -0,0.42 -0.07,0.83 -0.19,1.22 0.37,0.19 0.7,0.44 1,0.74 0.3,0.3 0.54,0.63 0.73,0.99 0.4,-0.12 0.81,-0.19 1.23,-0.19 0.42,0 0.83,0.07 1.22,0.19 0.19,-0.37 0.44,-0.7 0.74,-1.01 0.3,-0.3 0.63,-0.54 0.99,-0.73 -0.12,-0.39 -0.19,-0.81 -0.19,-1.23 0,-0.42 0.06,-0.83 0.19,-1.22 -0.37,-0.19 -0.71,-0.44 -1.01,-0.74 -0.3,-0.3 -0.54,-0.63 -0.73,-0.99 -0.39,0.12 -0.81,0.19 -1.23,0.19 -0.42,0 -0.82,-0.06 -1.21,-0.18zm-2.85 4.64c-0.86,1.5 -2.82,2.55 -5.11,2.54 -0.31,-0 -0.61,-0.02 -0.91,-0.06 0.19,-0.24 0.39,-0.47 0.61,-0.69 1.61,-1.61 3.74,-2.25 5.41,-1.79zm2.39 2.39c0.46,1.67 -0.19,3.8 -1.81,5.41 -0.22,0.22 -0.45,0.42 -0.68,0.6 -0.04,-0.3 -0.06,-0.61 -0.06,-0.92 0,-2.28 1.05,-4.24 2.55,-5.09zm3.38 -0c1.5,0.86 2.55,2.82 2.55,5.11 -0,0.31 -0.02,0.61 -0.06,0.91 -0.24,-0.19 -0.47,-0.39 -0.69,-0.61 -1.61,-1.61 -2.25,-3.74 -1.8,-5.4zm2.39 -2.39c1.67,-0.46 3.8,0.19 5.41,1.81 0.22,0.22 0.42,0.45 0.6,0.68 -0.3,0.04 -0.61,0.06 -0.92,0.06 -2.28,-0 -4.24,-1.05 -5.09,-2.55zm-0 -3.38c0.86,-1.5 2.82,-2.55 5.1,-2.55 0.31,0 0.61,0.02 0.91,0.06 -0.18,0.24 -0.39,0.47 -0.61,0.69 -1.61,1.61 -3.74,2.26 -5.4,1.8zm0.09 -8.4c0.04,0.3 0.06,0.61 0.06,0.92 0,2.28 -1.05,4.24 -2.54,5.1 -0.46,-1.67 0.19,-3.8 1.8,-5.41 0.22,-0.22 0.45,-0.42 0.68,-0.6z" />
            </g>
        </svg >
    );
};
