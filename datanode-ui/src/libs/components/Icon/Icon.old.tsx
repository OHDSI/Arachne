import clsx from 'clsx';
import React from 'react';
import { IconContainer } from './Icon.styles';

export interface IconOldProps {
  iconName?: string;
  className?: string;
  size?: number;
  name?: string;
  color?: string;
  fillColor?: string;
}

/*  @deprecated */
export const IconOld = React.forwardRef((props: IconOldProps, ref) => {
  const Component: React.FC<IconOldProps> = props.iconName
    ? components[props.iconName]
    : Edit;

  return (
    <IconContainer
      {...props}
      className={clsx(props.className, 'c-icon')}
      color={props.color}
      size={props.size}
      ref={ref}
    >
      <Component
        size={props.size || 24}
        name={props.name}
        fillColor={props.fillColor}
        color={props.color}
      />
    </IconContainer>
  );
});

const SaveCheck: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'cohort'}</title>
    <path
      d="M128.5,15.4c-0.7,0-1.5,0.2-2,0.7l-67.3,86.5L32.2,76.3c-1.3-1.3-2.5-2-3.4-2c-0.5,0-1.4,0.7-2.7,2
	c-3.6,3.6-8.5,8.8-14.8,15.5l-0.7,0.7c-0.3,0.5-0.5,1.1-0.7,1.7c0.1,0.7,0.3,1.4,0.7,2l1,1l47.5,45.8c0.8,1,2.1,1.6,3.4,1.7
	c0.7,0,1.7-0.7,3-2l83.8-107.7c0.4-0.6,0.6-1.3,0.7-2c-0.1-0.7-0.3-1.4-0.7-2l-18.5-14.8C130.1,15.7,129.3,15.4,128.5,15.4"
    />
  </svg>
);

const PlusChevron: React.FC<any> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'analysis'}</title>
    <g>
      <path
        d="M128,266.667h117.333V384c0,5.891,4.776,10.667,10.667,10.667c5.891,0,10.667-4.776,10.667-10.667V266.667H384
				c5.891,0,10.667-4.776,10.667-10.667c0-5.891-4.776-10.667-10.667-10.667H266.667V128c0-5.891-4.776-10.667-10.667-10.667
				c-5.891,0-10.667,4.776-10.667,10.667v117.333H128c-5.891,0-10.667,4.776-10.667,10.667
				C117.333,261.891,122.109,266.667,128,266.667z"
      />
      <path
        d="M501.333,0H10.667C4.776,0,0,4.776,0,10.667v490.667C0,507.224,4.776,512,10.667,512h490.667
				c5.891,0,10.667-4.776,10.667-10.667V10.667C512,4.776,507.224,0,501.333,0z M490.667,490.667H21.333V21.333h469.333V490.667z"
      />
    </g>
  </svg>
);

const MinusChevron: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'analysis'}</title>
    <g>
      <path
        d="M117.333,266.667H384c5.891,0,10.667-4.776,10.667-10.667c0-5.891-4.776-10.667-10.667-10.667H117.333
				c-5.891,0-10.667,4.776-10.667,10.667C106.667,261.891,111.442,266.667,117.333,266.667z"
      />
      <path
        d="M501.333,0H10.667C4.776,0,0,4.776,0,10.667v490.667C0,507.224,4.776,512,10.667,512h490.667
				c5.891,0,10.667-4.776,10.667-10.667V10.667C512,4.776,507.224,0,501.333,0z M490.667,490.667H21.333V21.333h469.333V490.667z"
      />
    </g>
  </svg>
);

const Analysis: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width={size}
    height={size}
    viewBox="0 0 160 160"
  >
    <path
      d="M130.4,46.8v94.7c0,4.7-3.8,8.5-8.5,8.5H30.2c-0.3,0-0.6-0.3-0.6-0.6v-6.8c0-5.2,4.2-9.3,9.3-9.3h0h42.9
 c2,0,3.7-1.6,3.7-3.7c0,0,0,0,0,0V87.5c0-2.8,2.2-5,5-5h2.1c5.2,0,9.4-4.2,9.4-9.4l0,0l0,0c0-5.8-4.6-10.5-10.4-10.5c0,0,0,0,0,0
 h-20V34.7h46.8C124.9,34.6,130.4,40,130.4,46.8C130.4,46.8,130.4,46.8,130.4,46.8z"
    />
    <path
      d="M46.9,26.5h20.2c2.2,0,4,1.8,4,4v37.8c0,2.2-1.8,4-4,4H46.9c-2.2,0-4-1.8-4-4V30.5
 C42.9,28.3,44.7,26.5,46.9,26.5z"
    />
    <path d="M66.2,26.5H47.9v-14c0-1.4,1.1-2.5,2.5-2.5c0,0,0,0,0,0h13.3c1.4,0,2.5,1.1,2.5,2.5V26.5z" />
    <path d="M47.9,72.2h18.3v14c0,1.4-1.1,2.5-2.5,2.5c0,0,0,0,0,0H50.3c-1.4,0-2.5-1.1-2.5-2.4c0,0,0,0,0,0V72.2z" />
    <path
      d="M117.3,107.7c0,5.4-4.4,9.9-9.9,9.9c-5.4,0-9.9-4.4-9.9-9.9c0-5.4,4.4-9.9,9.9-9.9c0,0,0,0,0,0
 C112.9,97.8,117.3,102.3,117.3,107.7C117.3,107.7,117.3,107.7,117.3,107.7z"
    />
    <g>
      <path
        d="M129.5,35.6c-3-3-7-4.7-11.2-4.7H74.8v-0.4c0-2.1-0.8-4-2.3-5.5c-0.8-0.8-1.7-1.3-2.7-1.7V12.5
   c0-3.4-2.8-6.2-6.2-6.2H50.3c-3.4,0-6.2,2.8-6.2,6.2c0,0,0,0,0,0v10.8c-3,1.2-4.9,4-4.9,7.2v37.8c0,2.1,0.8,4,2.3,5.5
   c0.8,0.8,1.7,1.4,2.7,1.7v10.8c0,3.4,2.8,6.2,6.2,6.2c0,0,0,0,0,0h13.3c3.4,0,6.2-2.8,6.2-6.2V75.4c3-1.1,4.9-4,4.9-7.2v-1.9h16.6
   c3.7,0,6.7,3,6.7,6.7l0,0c0,1.5-0.6,2.9-1.7,4c-1.1,1.1-2.5,1.7-4,1.6h-2c-4.9,0-8.8,3.9-8.8,8.8v13.3H36.1c-2.1,0-3.8,1.7-3.8,3.8
   s1.7,3.8,3.8,3.8h45.6v21.2H38.9c-7.2,0-13.1,5.9-13.1,13.1l0,0v6.8c0,2.4,2,4.4,4.4,4.4h91.7c6.8,0,12.3-5.5,12.3-12.3V46.8
   C134.2,42.6,132.5,38.5,129.5,35.6z M67.3,30.3l0.1,0.2v37.8l-0.1,0.2l-0.2,0.1H46.9l-0.2-0.1l-0.1-0.2V30.5l0.1-0.2l0.2-0.1h20.2
   L67.3,30.3z M51.6,76h10.8v9H51.6V76z M51.6,13.8h10.8v9H51.6L51.6,13.8z M126.7,141.5c0,2.6-2.1,4.8-4.7,4.8c0,0,0,0,0,0H33.3
   v-3.7c0-3.1,2.5-5.6,5.5-5.6c0,0,0,0,0.1,0h42.9c4.1,0,7.4-3.3,7.4-7.4v-25l0,0v-17c0-0.7,0.6-1.3,1.3-1.3h0h2.1
   c7.2,0,13.1-5.9,13.1-13.1c0,0,0,0,0,0l0,0c0-7.9-6.3-14.3-14.2-14.3c0,0,0,0-0.1,0H75.2V38.4h43.1c4.6,0,8.4,3.8,8.4,8.4l0,0
   L126.7,141.5z"
      />
      <path d="M70.7,122.2c2.1,0,3.8-1.7,3.8-3.8s-1.7-3.8-3.8-3.8H43.4c-2.1,0-3.8,1.7-3.8,3.8s1.7,3.8,3.8,3.8H70.7z" />
      <path
        d="M107.4,94.1c-7.5,0-13.6,6.1-13.6,13.6c0,7.5,6.1,13.6,13.6,13.6c7.5,0,13.6-6.1,13.6-13.6c0-3.6-1.4-7-4-9.6
   C114.5,95.5,111,94.1,107.4,94.1z M111.7,112c-2.4,2.4-6.2,2.4-8.6,0c-2.4-2.4-2.4-6.2,0-8.6c2.4-2.4,6.2-2.4,8.6,0
   c1.1,1.1,1.8,2.7,1.8,4.3C113.5,109.3,112.9,110.9,111.7,112z"
      />
    </g>
  </svg>
);
const Cohort: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'cohort'}</title>
    <path
      id="Group_People"
      data-name="Group People"
      d="M16.75,19H16v5.5a.5.5,0,0,1-.5.5h-6a.5.5,0,0,1-.5-.5V19H8.25A1.25,1.25,0,0,1,7,17.75v-3.5a4.25,4.25,0,0,1,3.23-4.11,3.5,3.5,0,1,1,4.55,0A4.25,4.25,0,0,1,18,14.25v3.5A1.25,1.25,0,0,1,16.75,19ZM6,17.75v-3.5A5.23,5.23,0,0,1,8.6,9.73a4.27,4.27,0,0,1-.41-3.45,4.39,4.39,0,0,0-.43-.14,3.5,3.5,0,1,0-4.55,0A4.25,4.25,0,0,0,0,10.25v3.5A1.25,1.25,0,0,0,1.24,15H2v5.5a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5V20A2.25,2.25,0,0,1,6,17.75ZM21.77,6.14a3.5,3.5,0,1,0-4.54,0,4.32,4.32,0,0,0-.42.14,4.27,4.27,0,0,1-.41,3.45A5.23,5.23,0,0,1,19,14.25v3.5A2.25,2.25,0,0,1,17,20v.51a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5V15h.75A1.25,1.25,0,0,0,25,13.75v-3.5A4.25,4.25,0,0,0,21.77,6.14Z"
    />
  </svg>
);

const Document: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'cohort'}</title>
    <path
      d="M19,3 L9.0085302,3 C7.8992496,3 7,3.89833832 7,5.00732994 L7,27.9926701 C7,29.1012878 7.89092539,30 8.99742191,30 L24.0025781,30 C25.1057238,30 26,29.1090746 26,28.0025781 L26,11 L21.0059191,11 C19.8980806,11 19,10.1132936 19,9.00189865 L19,3 L19,3 Z M20,3 L20,8.99707067 C20,9.55097324 20.4509752,10 20.990778,10 L26,10 L20,3 L20,3 Z M10,10 L10,11 L17,11 L17,10 L10,10 L10,10 Z M10,7 L10,8 L17,8 L17,7 L10,7 L10,7 Z M10,13 L10,14 L23,14 L23,13 L10,13 L10,13 Z M10,16 L10,17 L23,17 L23,16 L10,16 L10,16 Z M10,19 L10,20 L23,20 L23,19 L10,19 L10,19 Z M10,22 L10,23 L23,23 L23,22 L10,22 L10,22 Z M10,25 L10,26 L23,26 L23,25 L10,25 L10,25 Z"
      id="document-text"
    ></path>
  </svg>
);

const Participant: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'cohort'}</title>
    <g>
      <path
        d="M18.8,21.5c0.3-0.5,0.1-1.1-0.3-1.4L17,19.2V17c0-0.6-0.4-1-1-1s-1,0.4-1,1v2.2l-1.5,0.9c-0.5,0.3-0.6,0.9-0.3,1.4
		c0.3,0.5,0.9,0.6,1.4,0.3l1.4-0.9c0,0,0.1,0,0.1,0s0.1,0,0.1,0l1.4,0.9C17.6,22,17.8,22,18,22C18.3,22,18.7,21.8,18.8,21.5z"
      />
      <path
        d="M11,14l10,0c0.3,0,0.6-0.1,0.8-0.4c0.2-0.2,0.3-0.5,0.2-0.8c-0.3-1.5-1.4-2.7-2.9-3.1c-0.4-0.1-0.7-0.4-0.8-0.8
		C18.7,8.4,19,7.7,19,7V5c0-1.7-1.3-3-3-3s-3,1.3-3,3v2c0,0.7,0.3,1.4,0.7,1.9c-0.1,0.4-0.4,0.7-0.8,0.8c-1.5,0.4-2.6,1.6-2.8,3.1
		c-0.1,0.3,0,0.6,0.2,0.8C10.4,13.9,10.7,14,11,14z"
      />
      <path
        d="M27.1,25.7c-0.4-0.1-0.7-0.4-0.8-0.8c0.4-0.5,0.7-1.2,0.7-1.9v-2c0-1.7-1.3-3-3-3s-3,1.3-3,3v2c0,0.7,0.3,1.4,0.7,1.9
		c-0.1,0.4-0.4,0.7-0.8,0.8c-1.5,0.4-2.6,1.6-2.8,3.1c-0.1,0.3,0,0.6,0.2,0.8c0.2,0.2,0.5,0.4,0.8,0.4l10,0c0.3,0,0.6-0.1,0.8-0.4
		c0.2-0.2,0.3-0.5,0.2-0.8C29.7,27.3,28.5,26.1,27.1,25.7z"
      />
      <path
        d="M11.1,25.7c-0.4-0.1-0.7-0.4-0.8-0.8c0.4-0.5,0.7-1.2,0.7-1.9v-2c0-1.7-1.3-3-3-3s-3,1.3-3,3v2c0,0.7,0.3,1.4,0.7,1.9
		c-0.1,0.4-0.4,0.7-0.8,0.8c-1.5,0.4-2.6,1.6-2.8,3.1c-0.1,0.3,0,0.6,0.2,0.8C2.4,29.9,2.7,30,3,30l10,0c0.3,0,0.6-0.1,0.8-0.4
		c0.2-0.2,0.3-0.5,0.2-0.8C13.7,27.3,12.5,26.1,11.1,25.7z"
      />
    </g>
  </svg>
);

const DataSource: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'cohort'}</title>
    <g>
      <path d="M5,12.4V16c0,3.4,4.8,6,11,6s11-2.6,11-6v-3.6c-2.2,2.2-6.2,3.6-11,3.6S7.2,14.6,5,12.4z" />
      <path d="M5,20.4V24c0,3.4,4.8,6,11,6s11-2.6,11-6v-3.6c-2.2,2.2-6.2,3.6-11,3.6S7.2,22.6,5,20.4z" />
      <ellipse cx="16" cy="8" rx="11" ry="6" />
    </g>
  </svg>
);

const Edit: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'edit'}</title>
    <path
      d="M27.9,8.6l-2.4-2.4c-1-1-2.7-1-3.7,0L8.7,19.1l0,0l-1.2,3.5l-2.1,5.3c-0.2,0.5,0.3,0.9,0.8,0.7l4.8-2l3.8-1.4
	l0.1,0.1l12.9-12.9c0.5-0.5,0.8-1.2,0.8-1.9S28.4,9.1,27.9,8.6z M10.1,25L9,23.8l1.2-3.3l3.3,3.3L10.1,25z M11.3,19.1l9.2-9.2
	l3.6,3.6l-9.2,9.2L11.3,19.1z M26.6,11.1l-1.2,1.2l-3.6-3.6l1.2-1.2c0.3-0.3,0.9-0.3,1.2,0l2.4,2.4c0.2,0.2,0.2,0.4,0.2,0.6
	S26.7,10.9,26.6,11.1z"
    />{' '}
  </svg>
);

const Workspace: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'workspace'}</title>
    <g>
      <g>
        <path
          d="M13.5,21.8c-0.4,0-0.7-0.1-1-0.3l-2.7-1.4c-0.1-0.1-0.2-0.1-0.3,0l-2.7,1.4c-0.8,0.4-1.6,0.3-2.3-0.2
			c-0.7-0.5-1-1.3-0.9-2.2l0.5-3c0-0.1,0-0.2-0.1-0.3l-2.2-2.1c-0.6-0.6-0.8-1.5-0.6-2.3c0.3-0.8,0.9-1.4,1.8-1.5l3-0.4
			c0.1,0,0.2-0.1,0.3-0.2l1.3-2.7c0.4-0.8,1.1-1.2,2-1.2s1.6,0.5,2,1.2L13,9.4c0,0.1,0.1,0.2,0.3,0.2l3,0.4c0.8,0.1,1.5,0.7,1.8,1.5
			c0.3,0.8,0,1.7-0.6,2.3l-2.2,2.1c-0.1,0.1-0.1,0.2-0.1,0.3l0.5,3c0.1,0.8-0.2,1.7-0.9,2.2C14.5,21.7,14,21.8,13.5,21.8z M9.7,18.2
			c0.4,0,0.7,0.1,1,0.3l2.7,1.4c0.2,0.1,0.3,0,0.4,0s0.2-0.1,0.1-0.3l-0.5-3c-0.1-0.7,0.1-1.5,0.6-2l2.2-2.1
			c0.1-0.1,0.1-0.3,0.1-0.3s-0.1-0.2-0.3-0.2l-3-0.4c-0.7-0.1-1.3-0.6-1.7-1.2L10,7.6C9.9,7.4,9.8,7.4,9.7,7.4s-0.2,0-0.3,0.2
			l-1.3,2.7c-0.3,0.7-0.9,1.1-1.7,1.2l-3,0.4c-0.2,0-0.2,0.2-0.3,0.2s0,0.2,0.1,0.3l2.2,2.1c0.5,0.5,0.8,1.2,0.6,2l-0.5,3
			c0,0.2,0.1,0.3,0.1,0.3c0.1,0,0.2,0.1,0.4,0l2.7-1.4C9,18.3,9.3,18.2,9.7,18.2z"
        />
      </g>
      <g>
        <path
          d="M24.6,28.5H5.3c-1.5,0-2.6-1.2-2.6-2.6v-0.8h1.7v0.8c0,0.5,0.4,0.9,0.9,0.9h19.2c0.5,0,0.9-0.4,0.9-0.9V14.2
			c0-0.5-0.4-0.9-0.9-0.9h-3.7v-1.7h3.7c1.5,0,2.6,1.2,2.6,2.6v11.7C27.2,27.3,26,28.5,24.6,28.5z"
        />
      </g>
      <g>
        <path d="M32.8,23.7H31V11.7c0-2-1.6-3.6-3.6-3.6h-6.5V6.3h6.5c3,0,5.4,2.4,5.4,5.4V23.7z" />
      </g>
    </g>
  </svg>
);

const Copy: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'copy'}</title>
    <g>
      <g>
        <path d="M31.2,22.7h-1.8V11.4c0-1.9-1.5-3.4-3.4-3.4H6V6.3h20c2.8,0,5.2,2.3,5.2,5.2V22.7z" />
      </g>
      <g>
        <path
          d="M22.9,27.8H6.2c-1.9,0-3.4-1.5-3.4-3.4v-9.8c0-1.9,1.5-3.4,3.4-3.4h16.7c1.9,0,3.4,1.5,3.4,3.4v9.8
			C26.3,26.3,24.7,27.8,22.9,27.8z M6.2,13.1c-0.9,0-1.6,0.7-1.6,1.6v9.8c0,0.9,0.7,1.6,1.6,1.6h16.7c0.9,0,1.6-0.7,1.6-1.6v-9.8
			c0-0.9-0.7-1.6-1.6-1.6H6.2z"
        />
      </g>
    </g>
  </svg>
);

const Cancel: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'cancel'}</title>
    <polygon points="27.3,7.9 26,6.6 17,15.7 8,6.6 6.7,7.9 15.7,16.9 6.7,26 8,27.2 17,18.2 26,27.2 27.3,26 18.3,16.9 " />{' '}
  </svg>
);

const Delete: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width={size}
    height={size}
  >
    <title>{name || 'delete'}</title>
    <path d="M23 7h4v1h-2v18.993c0 1.671-1.343 3.007-3 3.007h-11c-1.666 0-3-1.346-3-3.007v-18.993h-2v-1h6v-1.995c0-1.111 0.894-2.005 1.997-2.005h5.005c1.102 0 1.997 0.898 1.997 2.005v1.995h2zM9 8v19.005c0 1.102 0.893 1.995 1.992 1.995h11.016c1.1 0 1.992-0.902 1.992-1.995v-19.005h-15zM12 10v17h1v-17h-1zM16 10v17h1v-17h-1zM20 10v17h1v-17h-1zM14.003 4c-0.554 0-1.003 0.443-1.003 0.999v2.001h7v-2.001c0-0.552-0.438-0.999-1.003-0.999h-4.994z"></path>
  </svg>
);

const Save: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'save'}</title>
    <path
      d="M26.6,14.6H12.3c-1.5,0-2.8,1.2-2.8,2.8v4.2c0,1.6,1.3,2.9,2.9,2.9h7.7l-4.2,4.2l1.3,1.3l6.4-6.4L23,22.9l0,0
	l-5.8-5.8l-1.3,1.3l4.2,4.2h-7.7c-0.6,0-1.1-0.5-1.1-1.1v-4.2c0-0.5,0.4-1,1-1h14.3c0.5,0,1,0.4,1,1v10.7c0,1.5-1.2,2.7-2.7,2.7H9.6
	c-1.7,0-3.2-1.4-3.2-3.2V16.1c0-0.6,0.1-1.7,0.2-2c0.3-0.7,0.9-1.2,1.7-1.4L9,12.6c1-0.2,1.8-0.9,2.2-1.8c0.3-0.6,0.4-1.2,0.4-1.8
	V8.4c0-1.9,0.7-5.2,5.7-5.2c5.8,0,6.1,4.6,6.1,5.6v2.4h1.8V8.8c0-3.4-2.1-7.4-7.9-7.4c-5.6,0-7.5,3.6-7.5,7V9c0,0.4-0.1,0.7-0.2,1.1
	c-0.2,0.4-0.5,0.6-1,0.7L8,11c-1.4,0.3-2.6,1.3-3,2.6c-0.2,0.7-0.3,2.1-0.3,2.6v11.5c0,2.7,2.2,5,5,5h15.3c2.5,0,4.5-2,4.5-4.5V17.3
	C29.4,15.8,28.1,14.6,26.6,14.6z"
    />
  </svg>
);
const Import: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'import'}</title>
    <g>
      <path
        fill="evenodd"
        d="M13.9,10.7v6.8l-4.3-4.3l-1.3,1.3l6.4,6.4l0.6-0.6l0,0l5.8-5.8l-1.3-1.3l-4.1,4.1v-6.6c0-2.3-1.9-4.1-4.1-4.1
		H5v1.8h6.5C12.8,8.4,13.9,9.4,13.9,10.7z"
      />
      <path
        fill="evenodd"
        d="M27.2,9.5h-3.7v1.8h3.7c0.5,0,1,0.4,1,1v12.4c0,0.5-0.4,1-1,1H6.8c-0.5,0-1-0.4-1-1v-4.6H4v4.6
		c0,1.5,1.3,2.8,2.8,2.8h20.4c1.5,0,2.8-1.3,2.8-2.8V12.2C30,10.7,28.7,9.5,27.2,9.5z"
      />
    </g>
  </svg>
);

const Download: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'download'}</title>
    <g>
      <polygon
        points="17.6,20.8 17.6,20.8 23.4,15 22.1,13.8 18,17.9 18,6.6 16.2,6.6 16.2,18.1 11.9,13.8 10.6,15 17,21.4 
			"
      />
      <polygon points="27.3,18.2 27.3,25.4 6.7,25.4 6.7,18.2 4.9,18.2 4.9,27.2 29.1,27.2 29.1,18.2 	" />
    </g>{' '}
  </svg>
);

const Add: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'add'}</title>
    <g>
      <path
        d="M17,4.3C10,4.3,4.4,10,4.4,16.9c0,7,5.7,12.7,12.7,12.7s12.7-5.7,12.7-12.7C29.7,10,24,4.3,17,4.3z M17,27.8
		c-6,0-10.9-4.9-10.9-10.9S11,6.1,17,6.1s10.9,4.9,10.9,10.9S23,27.8,17,27.8z"
      />
      <polygon
        points="17.9,9.8 16.1,9.8 16.1,16 9.9,16 9.9,17.8 16.1,17.8 16.1,24 17.9,24 17.9,17.8 24.1,17.8 24.1,16 
		17.9,16 	"
      />
    </g>
  </svg>
);

const Search: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'search'}</title>
    <path
      d="M29.9,23.9l-4.3-4.3c2-4.1,1.3-9.1-2.1-12.5c-4.3-4.3-11.3-4.3-15.6,0s-4.3,11.3,0,15.6
	c2.1,2.1,4.8,3.2,7.8,3.2c1.7,0,3.3-0.4,4.8-1.1l4.3,4.3c0.6,0.6,1.5,1,2.4,1c0.9,0,1.8-0.4,2.4-1l0.4-0.4c0.6-0.6,1-1.5,1-2.4
	S30.5,24.6,29.9,23.9z M9.2,21.4c-3.6-3.6-3.6-9.4,0-13c1.8-1.8,4.2-2.7,6.5-2.7s4.7,0.9,6.5,2.7c3.6,3.6,3.6,9.4,0,13
	c-1.7,1.7-4,2.7-6.5,2.7S10.9,23.1,9.2,21.4z M28.6,27.4l-0.4,0.4c-0.6,0.6-1.6,0.6-2.2,0L22.1,24l2.6-2.6l3.8,3.8
	c0.3,0.3,0.5,0.7,0.5,1.1S28.9,27.1,28.6,27.4z"
    />
  </svg>
);

const Warning: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'Warning'}</title>
    <g>
      <path
        fill="none"
        clipRule="evenodd"
        strokeMiterlimit={10}
        strokeWidth={1.8}
        d="M28.7,27.4l-23.4,0c-1.5,0-2.1-1.1-1.4-2.4L15.6,4.8c0.8-1.3,2-1.3,2.7,0l11.7,20.3
		C30.8,26.4,30.2,27.4,28.7,27.4z"
      />
      <path
        fill="currentColor"
        clipRule="evenodd"
        d="M18.2,18.5V13c0-0.6-0.5-1.1-1.1-1.1h-0.2c-0.6,0-1.1,0.5-1.1,1.1v5.4c0,0.6,0.5,1.1,1.1,1.1h0.2
		C17.7,19.5,18.2,19.1,18.2,18.5z"
      />
      <path
        fill="currentColor"
        clipRule="evenodd"
        d="M18.4,23c0-0.7-0.6-1.4-1.4-1.4c-0.7,0-1.4,0.6-1.4,1.4c0,0.7,0.6,1.4,1.4,1.4C17.7,24.4,18.4,23.8,18.4,23z"
      />
    </g>
  </svg>
);

const Info: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'Info'}</title>
    <g>
      <g>
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeMiterlimit={10}
          d="M29.4,16.2c0,6.5-5.3,11.8-11.8,11.8c-1.5,0-3-0.3-4.3-0.8c-1.1-0.4-4.3,1.8-5.2,1.1c-0.7-0.6,0.9-4,0.3-4.7
			c-1.6-2-2.5-4.5-2.5-7.3c0-6.5,5.3-11.8,11.8-11.8S29.4,9.7,29.4,16.2z"
        />
      </g>
      <g>
        <path
          fill="currentColor"
          d="M19.5,13.6l-2,6.8c-0.1,0.4-0.2,0.6-0.2,0.8c0,0.1,0,0.1,0.1,0.2c0.1,0.1,0.1,0.1,0.2,0.1
			c0.1,0,0.2,0,0.3-0.1c0.3-0.2,0.6-0.7,1-1.3l0.3,0.2c-1,1.7-2,2.5-3.1,2.5c-0.4,0-0.7-0.1-1-0.3c-0.2-0.2-0.4-0.5-0.4-0.9
			c0-0.2,0.1-0.5,0.2-0.9l1.3-4.6c0.1-0.4,0.2-0.8,0.2-1c0-0.1-0.1-0.3-0.2-0.4c-0.1-0.1-0.3-0.2-0.5-0.2c-0.1,0-0.2,0-0.3,0
			l0.1-0.4l3.2-0.5H19.5z M18.9,9.2c0.4,0,0.7,0.1,1,0.4c0.3,0.3,0.4,0.6,0.4,1c0,0.4-0.1,0.7-0.4,1c-0.3,0.3-0.6,0.4-1,0.4
			c-0.4,0-0.7-0.1-1-0.4c-0.3-0.3-0.4-0.6-0.4-1c0-0.4,0.1-0.7,0.4-1C18.2,9.4,18.5,9.2,18.9,9.2z"
        />
      </g>
    </g>
  </svg>
);

const Critical: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'Critical'}</title>
    <g>
      <g>
        <line
          fill="none"
          strokeWidth={1.8}
          stroke="currentColor"
          x1="12"
          y1="10.5"
          x2="22"
          y2="20.5"
        />
        <line
          fill="none"
          strokeWidth={1.8}
          stroke="currentColor"
          x1="22"
          y1="10.5"
          x2="12"
          y2="20.5"
        />
      </g>
      <path
        fill="none"
        clipRule="evenodd"
        strokeMiterlimit={10}
        strokeWidth={1.8}
        stroke="currentColor"
        d="M24.6,26.4h-3.4L17,30.7l-3.7-4.2H9.4c-2.1,0-3.9-1.7-3.9-3.9V8.3c0-2.1,1.7-3.9,3.9-3.9h15.3
        c2.1,0,3.9,1.7,3.9,3.9v14.3C28.5,24.7,26.8,26.4,24.6,26.4z"
      />
    </g>
  </svg>
);

const Calendar: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'calendar'}</title>
    <g>
      <rect x="14.8" y="17" width="1.9" height="1.9" />
      <rect x="18.7" y="17" width="1.9" height="1.9" />
      <rect x="11.1" y="17" width="1.9" height="1.9" />
      <rect x="11.1" y="21" width="1.9" height="1.9" />
      <rect x="14.8" y="21" width="1.9" height="1.9" />
      <path
        d="M24,7.7h-1V6.2h-1.8v1.5h-8.1V6.2h-1.8v1.5h-1c-2.7,0-4.9,2.2-4.9,4.9V23c0,2.7,2.2,4.9,4.9,4.9H24
		c2.6,0,4.8-2.1,4.9-4.8V12.6C28.9,9.9,26.7,7.7,24,7.7z M10.3,9.5h1v1.4h1.8V9.5h8.1v1.4H23V9.5h1c1.7,0,3.1,1.4,3.1,3.1v0.2H7.2
		v-0.2C7.2,10.9,8.6,9.5,10.3,9.5z M24,26.2H10.3c-1.7,0-3.1-1.4-3.1-3.1v-8.5h19.9v8.5C27.1,24.8,25.7,26.2,24,26.2z"
      />
    </g>
  </svg>
);

const ChevronRight: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'chevronRight'}</title>
    <g>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </g>
  </svg>
);

const ChevronDown: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'chevronDown'}</title>
    <g>
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
    </g>
  </svg>
);
const Reload: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'reload'}</title>
    <g>
      <path d="M7 9h-7v-7h1v5.2c1.853-4.237 6.083-7.2 11-7.2 6.623 0 12 5.377 12 12s-5.377 12-12 12c-6.286 0-11.45-4.844-11.959-11h1.004c.506 5.603 5.221 10 10.955 10 6.071 0 11-4.929 11-11s-4.929-11-11-11c-4.66 0-8.647 2.904-10.249 7h5.249v1z"></path>
    </g>
  </svg>
);

const FileExt: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'file'}</title>
    <g>
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path>
    </g>
  </svg>
);

const ZoomIn: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'Zoom In'}</title>
    <g>
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
      <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"></path>
    </g>
  </svg>
);

const ZoomOut: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'Zoom Out'}</title>
    <g>
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"></path>{' '}
    </g>
  </svg>
);

const List: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'list'}</title>
    <g>
      <rect x="14.3" y="25.2" width="16.3" height="1.8" />
      <rect x="14.3" y="19.1" width="16.3" height="1.8" />
      <rect x="14.3" y="13" width="16.3" height="1.8" />
      <rect x="14.3" y="6.8" width="16.3" height="1.8" />
      <rect x="8.6" y="25.2" width="2.5" height="1.8" />
      <rect x="8.6" y="19.1" width="2.5" height="1.8" />
      <rect x="8.6" y="13" width="2.5" height="1.8" />
      <rect x="8.6" y="6.8" width="2.5" height="1.8" />
      <rect x="3.4" y="25.2" width="2.5" height="1.8" />
      <rect x="3.4" y="19.1" width="2.5" height="1.8" />
      <rect x="3.4" y="13" width="2.5" height="1.8" />
      <rect x="3.4" y="6.8" width="2.5" height="1.8" />
    </g>
  </svg>
);

const Tiles: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'tiles'}</title>
    <g>
      <path d="M15.3,14.8H2V5.9h13.3V14.8z M3.8,13h9.7V7.7H3.8V13z" />
      <path d="M32,14.8H18.7V5.9H32V14.8z M20.5,13h9.7V7.7h-9.7V13z" />
      <path d="M15.3,27.6H2v-8.9h13.3V27.6z M3.8,25.8h9.7v-5.3H3.8V25.8z" />
      <path d="M32,27.6H18.7v-8.9H32V27.6z M20.5,25.8h9.7v-5.3h-9.7V25.8z" />
    </g>
  </svg>
);

const User: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'user'}</title>
    <g>
      <path
        d="M17,16.6c-3.9,0-7.1-3.2-7.1-7.1c0-3.9,3.2-7.1,7.1-7.1s7.1,3.2,7.1,7.1C24.1,13.4,20.9,16.6,17,16.6z
			 M17,4.2c-2.9,0-5.3,2.4-5.3,5.3c0,2.9,2.4,5.3,5.3,5.3s5.3-2.4,5.3-5.3C22.3,6.6,19.9,4.2,17,4.2z"
      />
      <path
        d="M28.6,30.2H5.4v-0.9c0-6.4,5.2-11.6,11.6-11.6s11.6,5.2,11.6,11.6V30.2z M7.2,28.4h19.6
				c-0.5-5-4.7-8.9-9.8-8.9S7.7,23.4,7.2,28.4z"
      />
    </g>
  </svg>
);

const Studies: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'studies'}</title>

    <g>
      <g>
        <path
          d="M27.2,27.5H6.8c-1.5,0-2.8-1.3-2.8-2.8v-4.8h1.8v4.8c0,0.5,0.4,1,1,1h20.4c0.5,0,1-0.4,1-1V12.3
			c0-0.5-0.4-1-1-1h-4V9.5h4c1.5,0,2.8,1.3,2.8,2.8v12.4C30,26.2,28.7,27.5,27.2,27.5z"
        />
      </g>
      <g>
        <path
          d="M16.5,16.5H6.3c-1.3,0-2.3-1-2.3-2.3V8.9c0-1.3,1-2.3,2.3-2.3h10.2c1.3,0,2.3,1,2.3,2.3v5.3
			C18.8,15.4,17.8,16.5,16.5,16.5z M6.3,8.3c-0.3,0-0.5,0.2-0.5,0.5v5.3c0,0.3,0.2,0.5,0.5,0.5h10.2c0.3,0,0.5-0.2,0.5-0.5V8.9
			c0-0.3-0.2-0.5-0.5-0.5H6.3z"
        />
      </g>
    </g>
  </svg>
);

const Public: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'public'}</title>
    <g>
      <path
        d="M24.5,12.1H11.7V9.6c0-3,2.4-5.4,5.4-5.4c2.8,0,5.2,2.2,5.4,5l1.7-0.1c-0.3-3.7-3.4-6.6-7.1-6.6
		c-3.9,0-7.1,3.2-7.1,7.1v2.5H9.4c-2.1,0-3.8,1.7-3.8,3.8v11c0,2.1,1.7,3.8,3.8,3.8h15.2c2.1,0,3.8-1.7,3.8-3.8v-11
		C28.4,13.8,26.6,12.1,24.5,12.1z M26.6,27c0,1.1-0.9,2-2,2H9.4c-1.1,0-2-0.9-2-2v-11c0-1.1,0.9-2,2-2h15.2c1.1,0,2,0.9,2,2V27z"
      />
      <path
        d="M17,17.4L17,17.4c-0.7,0-1.2,0.5-1.2,1.1v5.5c0,0.6,0.5,1.1,1.1,1.1h0c0.6,0,1.1-0.5,1.1-1.1v-5.5
		C18.1,17.9,17.6,17.4,17,17.4z"
      />
    </g>
  </svg>
);

const Private: React.FC<IconOldProps> = ({ name, size }) => {
  return (
    <svg
      className="icon"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 34 34"
      width={size}
      height={size}
    >
      <title>{name || 'private'}</title>
      <path
        d="M24,12V9.5c0-3.9-3.1-7-7-7s-7,3.1-7,7V12c-2.2,0.1-4,1.6-4,3.5v11.7c0,1.9,1.9,3.5,4.1,3.5h13.8
	c2.3,0,4.1-1.6,4.1-3.5V15.5C28,13.6,26.2,12,24,12z M18.1,24.2c0,0.6-0.5,1.1-1.1,1.1s-1.1-0.5-1.1-1.1v-5.6c0-0.6,0.5-1.1,1.1-1.1
	s1.1,0.5,1.1,1.1V24.2z M22.2,12H11.8V9.5c0-2.9,2.3-5.2,5.2-5.2s5.2,2.3,5.2,5.2V12z"
      />
    </svg>
  );
};

const HealthStatus: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'Health Status'}</title>
    <path d="M20.2 5.9l.8-.8C19.6 3.7 17.8 3 16 3s-3.6.7-5 2.1l.8.8C13 4.8 14.5 4.2 16 4.2s3 .6 4.2 1.7zm-.9.8c-.9-.9-2.1-1.4-3.3-1.4s-2.4.5-3.3 1.4l.8.8c.7-.7 1.6-1 2.5-1 .9 0 1.8.3 2.5 1l.8-.8zM19 13h-2V9h-2v4H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM8 18H6v-2h2v2zm3.5 0h-2v-2h2v2zm3.5 0h-2v-2h2v2z"></path>
  </svg>
);

const Refresh: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'Refresh'}</title>
    <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"></path>{' '}
  </svg>
);

const LeadInvestigator: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'Lead Investigator'}</title>
    <circle cx="9" cy="9" r="4"></circle>
    <path d="M9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7.76-9.64l-1.68 1.69c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27zM20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14z"></path>{' '}
  </svg>
);

const Contributor: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'Contributor'}</title>
    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>{' '}
  </svg>
);

const DataSetOwner: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'Data Set Owner'}</title>
    <path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"></path>{' '}
  </svg>
);

const Accept: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'Accept'}</title>
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
  </svg>
);
const Filter: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'Filter'}</title>
    <g>
      <path
        d="M9.7,17.4V7H7.9v10.4c-1.6,0.4-2.8,1.8-2.8,3.5c0,1.7,1.2,3.1,2.8,3.5V27h1.8v-2.5c1.6-0.4,2.8-1.8,2.8-3.5
		C12.5,19.2,11.3,17.8,9.7,17.4z M9.7,22.7c-0.3,0.1-0.6,0.2-0.9,0.2s-0.6-0.1-0.9-0.2c-0.6-0.3-1.1-1-1.1-1.8
		c0-0.8,0.4-1.4,1.1-1.8C8.2,19,8.5,19,8.8,19s0.6,0.1,0.9,0.2c0.6,0.3,1.1,1,1.1,1.8C10.8,21.7,10.3,22.4,9.7,22.7z"
      />
      <path
        d="M17.6,10.4V7h-1.8v3.4C14.2,10.8,13,12.2,13,14s1.2,3.1,2.8,3.5V27h1.8v-9.5c1.6-0.4,2.8-1.8,2.8-3.5
		S19.2,10.8,17.6,10.4z M17.6,15.7C17.3,15.9,17,16,16.7,16s-0.6-0.1-0.9-0.2c-0.6-0.3-1.1-1-1.1-1.8s0.4-1.4,1.1-1.8
		c0.3-0.1,0.6-0.2,0.9-0.2s0.6,0.1,0.9,0.2c0.6,0.3,1.1,1,1.1,1.8S18.3,15.4,17.6,15.7z"
      />
      <path
        d="M26.2,13.9V7h-1.8v6.9c-1.6,0.4-2.8,1.8-2.8,3.5c0,1.7,1.2,3.1,2.8,3.5V27h1.8V21c1.6-0.4,2.8-1.8,2.8-3.5
		C28.9,15.8,27.7,14.4,26.2,13.9z M26.2,19.3c-0.3,0.1-0.6,0.2-0.9,0.2s-0.6-0.1-0.9-0.2c-0.6-0.3-1.1-1-1.1-1.8
		c0-0.8,0.4-1.4,1.1-1.8c0.3-0.1,0.6-0.2,0.9-0.2s0.6,0.1,0.9,0.2c0.6,0.3,1.1,1,1.1,1.8C27.3,18.3,26.8,18.9,26.2,19.3z"
      />
    </g>
  </svg>
);

// TODO: Replace Icon
const DataCatalog: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'Data catalog'}</title>
    <g>
      <g>
        <path
          d="M13.5,21.8c-0.4,0-0.7-0.1-1-0.3l-2.7-1.4c-0.1-0.1-0.2-0.1-0.3,0l-2.7,1.4c-0.8,0.4-1.6,0.3-2.3-0.2
			c-0.7-0.5-1-1.3-0.9-2.2l0.5-3c0-0.1,0-0.2-0.1-0.3l-2.2-2.1c-0.6-0.6-0.8-1.5-0.6-2.3c0.3-0.8,0.9-1.4,1.8-1.5l3-0.4
			c0.1,0,0.2-0.1,0.3-0.2l1.3-2.7c0.4-0.8,1.1-1.2,2-1.2s1.6,0.5,2,1.2L13,9.4c0,0.1,0.1,0.2,0.3,0.2l3,0.4c0.8,0.1,1.5,0.7,1.8,1.5
			c0.3,0.8,0,1.7-0.6,2.3l-2.2,2.1c-0.1,0.1-0.1,0.2-0.1,0.3l0.5,3c0.1,0.8-0.2,1.7-0.9,2.2C14.5,21.7,14,21.8,13.5,21.8z M9.7,18.2
			c0.4,0,0.7,0.1,1,0.3l2.7,1.4c0.2,0.1,0.3,0,0.4,0s0.2-0.1,0.1-0.3l-0.5-3c-0.1-0.7,0.1-1.5,0.6-2l2.2-2.1
			c0.1-0.1,0.1-0.3,0.1-0.3s-0.1-0.2-0.3-0.2l-3-0.4c-0.7-0.1-1.3-0.6-1.7-1.2L10,7.6C9.9,7.4,9.8,7.4,9.7,7.4s-0.2,0-0.3,0.2
			l-1.3,2.7c-0.3,0.7-0.9,1.1-1.7,1.2l-3,0.4c-0.2,0-0.2,0.2-0.3,0.2s0,0.2,0.1,0.3l2.2,2.1c0.5,0.5,0.8,1.2,0.6,2l-0.5,3
			c0,0.2,0.1,0.3,0.1,0.3c0.1,0,0.2,0.1,0.4,0l2.7-1.4C9,18.3,9.3,18.2,9.7,18.2z"
        />
      </g>
      <g>
        <path
          d="M24.6,28.5H5.3c-1.5,0-2.6-1.2-2.6-2.6v-0.8h1.7v0.8c0,0.5,0.4,0.9,0.9,0.9h19.2c0.5,0,0.9-0.4,0.9-0.9V14.2
			c0-0.5-0.4-0.9-0.9-0.9h-3.7v-1.7h3.7c1.5,0,2.6,1.2,2.6,2.6v11.7C27.2,27.3,26,28.5,24.6,28.5z"
        />
      </g>
      <g>
        <path d="M32.8,23.7H31V11.7c0-2-1.6-3.6-3.6-3.6h-6.5V6.3h6.5c3,0,5.4,2.4,5.4,5.4V23.7z" />
      </g>
    </g>
  </svg>
);

const Favorite: React.FC<IconOldProps> = ({ name, size, color, fillColor }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
    width={size}
    height={size}
  >
    <title>{name || 'Filter'}</title>
    <g>
      <path
        fill={color}
        d="M24.1,31c-0.5,0-1-0.1-1.5-0.4L17.7,28c-0.4-0.2-0.9-0.2-1.4,0l-4.9,2.6C10.3,31.2,9,31.1,8,30.4
		s-1.5-2-1.3-3.2l0.9-5.5c0.1-0.5-0.1-1-0.4-1.3l-4-3.9c-0.9-0.9-1.2-2.2-0.8-3.4s1.4-2,2.6-2.2l5.5-0.8c0.5-0.1,0.9-0.4,1.1-0.8
		l2.5-5c0.6-1.1,1.7-1.8,2.9-1.8l0,0c1.3,0,2.4,0.7,2.9,1.8l2.5,5c0.2,0.4,0.6,0.7,1.1,0.8l5.5,0.8c1.2,0.2,2.3,1,2.6,2.2
		c0.4,1.2,0.1,2.5-0.8,3.4l-4,3.9c-0.3,0.3-0.5,0.8-0.4,1.3l0.9,5.5c0.2,1.2-0.3,2.5-1.3,3.2C25.5,30.8,24.8,31,24.1,31z M17,26.1
		c0.5,0,1,0.1,1.5,0.4l4.9,2.6c0.5,0.3,1.1,0.2,1.5-0.1c0.5-0.3,0.7-0.9,0.6-1.4L24.6,22c-0.2-1.1,0.2-2.1,0.9-2.9l4-3.9
		c0.4-0.4,0.5-1,0.4-1.5c-0.2-0.5-0.6-0.9-1.2-1l-5.5-0.8c-1.1-0.2-2-0.8-2.5-1.8l-2.5-5C18,4.6,17.5,4.3,17,4.3l0,0
		c-0.6,0-1.1,0.3-1.3,0.8l-2.5,5c-0.5,1-1.4,1.6-2.5,1.8l-5.5,0.8c-0.6,0.1-1,0.5-1.2,1s0,1.1,0.4,1.5l4,3.9
		c0.8,0.8,1.1,1.8,0.9,2.9l-0.9,5.5c-0.1,0.6,0.1,1.1,0.6,1.4s1,0.4,1.5,0.1l4.9-2.6C15.9,26.2,16.4,26.1,17,26.1z"
      />
      <path
        fill={fillColor || 'transparent'}
        d="M17,4.3c-0.6,0-1.1,0.3-1.3,0.8l-2.5,5c-0.5,1-1.4,1.6-2.5,1.8l-5.5,0.8c-0.6,0.1-1,0.5-1.2,1s0,1.1,0.4,1.5
	l4,3.9c0.8,0.8,1.1,1.8,0.9,2.9l-0.9,5.5c-0.1,0.6,0.1,1.1,0.6,1.4s1,0.4,1.5,0.1l4.9-2.6c0.5-0.2,1-0.3,1.6-0.3
	c0.5,0,1,0.1,1.5,0.4l4.9,2.6c0.5,0.3,1.1,0.2,1.5-0.1c0.5-0.3,0.7-0.9,0.6-1.4L24.6,22c-0.2-1.1,0.2-2.1,0.9-2.9l4-3.9
	c0.4-0.4,0.5-1,0.4-1.5c-0.2-0.5-0.6-0.9-1.2-1l-5.5-0.8c-1.1-0.2-2-0.8-2.5-1.8l-2.5-5C18,4.6,17.5,4.3,17,4.3L17,4.3"
      />
    </g>
  </svg>
);

const Comment: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'Comment'}</title>
    <g>
      <path d="M0 0h24v24H0V0z" fill="none" />
    </g>
    <g>
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </g>
  </svg>
);

const Trash: React.FC<IconOldProps> = ({ name, size }) => (
  <svg
    className="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <title>{name || 'Comment'}</title>
    <g>
      <path
        d="M44,65.7v52.4c0,1.5,0.6,2.9,1.6,4c2.2,2.2,5.8,2.2,7.9,0c1.1-1.1,1.6-2.5,1.6-4V65.7c0-3.1-2.5-5.6-5.6-5.6
		S44,62.6,44,65.7z"
      />
      <path
        d="M148.4,31.7c-1.1-1.1-2.6-1.7-4.1-1.6h-28.7V21c0-2.9-1.1-5.8-3.3-7.8c-2-2.1-4.9-3.3-7.8-3.2h-49c-6.1,0-11,4.9-11,11
		c0,0,0,0,0,0v9.1H15.6c-3.1,0-5.6,2.5-5.6,5.6c0,1.5,0.6,2.9,1.6,3.9c1,1.1,2.5,1.7,4,1.7h4.8V139c0,2.9,1.1,5.8,3.3,7.8
		c2,2.1,4.8,3.3,7.8,3.2H130c2.9,0,5.7-1.1,7.8-3.2c2.1-2,3.3-4.8,3.3-7.8V41.2h3.1c1.5,0,3-0.6,4.1-1.7c1.1-1,1.8-2.4,1.8-3.9
		C150,34.2,149.4,32.8,148.4,31.7z M55.4,21.1h49.1v9H55.4L55.4,21.1z M130,139H31.5V41.2H130V139z"
      />
      <path
        d="M109.9,123.8c1.5,0,3-0.6,4-1.7c1.1-1.1,1.7-2.5,1.6-4V65.7c0-1.5-0.6-2.9-1.6-4c-2.2-2.2-5.7-2.2-7.9-0.1c0,0,0,0-0.1,0.1
		c-1.1,1.1-1.7,2.5-1.6,4v52.4c0,1.5,0.6,2.9,1.6,4C107,123.2,108.4,123.8,109.9,123.8z"
      />
      <path
        d="M79.9,123.8c1.5,0,2.9-0.6,3.9-1.7c1.1-1.1,1.7-2.5,1.6-4V65.7c0-1.5-0.6-2.9-1.6-4c-2.1-2.2-5.5-2.2-7.7-0.1
		c0,0-0.1,0.1-0.1,0.1c-1.1,1.1-1.7,2.5-1.6,4v52.4c0,1.5,0.6,2.9,1.6,4C77,123.2,78.4,123.8,79.9,123.8z"
      />
    </g>
  </svg>
);

export const components: { [key: string]: React.FC<IconOldProps> } = {
  document: Document,
  edit: Edit,
  reload: Reload,
  copy: Copy,
  delete: Delete,
  save: Save,
  download: Download,
  import: Import,
  info: Info,
  warning: Warning,
  critical: Critical,
  calendar: Calendar,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  fileExt: FileExt,
  zoomIn: ZoomIn,
  zoomOut: ZoomOut,
  list: List,
  tiles: Tiles,
  user: User,
  studies: Studies,
  public: Public,
  private: Private,
  healthStatus: HealthStatus,
  refresh: Refresh,
  leadInvestigator: LeadInvestigator,
  contributor: Contributor,
  dataSetOwner: DataSetOwner,
  accept: Accept,
  cancel: Cancel,
  dataCatalog: DataCatalog,
  filter: Filter,
  favorite: Favorite,
  comment: Comment,
  trash: Trash,
  PlusChevron,
  MinusChevron,
  saveCheck: SaveCheck,
};
