import React from 'react';

export const ChatBubble: React.FC<any> = React.forwardRef(
  ({ plain, ...rest }, ref) => {
    return (
      <svg
        className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        data-testid="ChatBubbleIcon"
        ref={ref}
        {...rest}
      >
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path>
      </svg>
    );
  }
);
