import React from 'react';

export const ShowFolder: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    console.log('dssdsd')
    return (
      <svg
        viewBox="0 0 90 90"
        fill="currentColor"
        height="100px"
        width="100px"
      >
        <path d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316-.105-.316C21.927 11.617 19.633 5 12 5zm0 11c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
        <path d="M12 10c-1.084 0-2 .916-2 2s.916 2 2 2 2-.916 2-2-.916-2-2-2z" />
      </svg>
    );
  }
);