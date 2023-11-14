import { darken, transparentize } from 'polished';
import { Box, BoxProps } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { StyledComponent } from '@emotion/styled';

export const ModalContainer: StyledComponent<BoxProps> = styled(Box, {
  shouldForwardProp: prop => prop !== 'width',
})<{
  width?: string;
}>((props: any) => {
  return {
    position: 'absolute',
    top: '0',
    right: '0',
    width: props.width ? props.width : '75vw',
    height: '100vh',
    maxWidth: '100%',
    overflowY: 'auto',
    backgroundColor: props.theme.palette.backgroundColor.dark,
    [props.theme.breakpoints.down('md')]: {
      width: '100%',
    },
  };
});

export const TitleLayout: StyledComponent<any> = styled('div')(
  props => `
  display: flex;
  align-items: center;
  padding: 16px;
  justify-content: space-between;
  white-space: pre-wrap;
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-color-light, lightgrey);
  

  .modal-title {
    /* margin-top: 12px; */
    font-weight: 300;
    font-size: 24px;
    line-height: 26px;
    color: var(--text-header, grey);
  }
`
);

//@deprecated
export const CloseButton = styled('button') <any>`
  display: block;
  width: 28px;
  height: 28px;
  padding: 6px;
  position: relative;
  align-items: center;
  cursor: pointer;
  border: none;
  background: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  &:hover {
    opacity: 1;
    background-color: ${(props: { theme: Theme }) =>
    transparentize(0.9, props.theme.palette?.secondary.main || '#55719d')};
  }
  &:before,
  &:after {
    position: absolute;
    left: 13px;
    top: 5px;
    content: '';
    height: 18px;
    width: ${(props: any) => (props.error ? 2 : 2)}px;
    background-color: ${(props: any) =>
    props.error ? props.theme.palette?.error.main : '#3b3b3b'};
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`;
export const ModalBlockedLayout: StyledComponent<any> = styled('div')`
  font-family: sans-serif;
  position: fixed;
  width: 100vw;
  height: 100vh;
  right: 0;
  top: 0;
  z-index: 10;
  background: rgb(0, 0, 0, 20%);
  overflow-y: hidden;
`;

export const ModalContentBlock = styled('div') <any>`
  transition: width 0ms ease-in;
  transition-delay: 0ms;
  overflow-x: hidden;
  white-space: nowrap;
  height: 100%;
  background: #f1f3f8;
  width: ${({ width }) => width};
  max-width: calc(100vw - 54px);
`;

export const HideButtonContainer: StyledComponent<any> = styled('div')`
  position: absolute;
  width: 24px;
  height: calc(100vh - 42px);
  left: -14px;
  top: 0;
  visibility: hidden;
  :before {
    content: '';
    display: block;
    /* height: 100vh; */
    position: absolute;
    left: 12px;
    top: 0;
    background-color: ${darken(0.2)('#d8e1ef')};
    width: 2px;
    transition: height 300ms ease-in;
    transition-delay: 100ms;
  }
  :hover {
    &:before {
      height: 100vh;
    }
  }
`;

export const HideButton = styled('div') <any>`
  visibility: hidden;
  position: absolute;
  background-color: #ffffff;
  width: 23px;
  height: 23px;
  top: 150px;
  left: 1px;
  border-radius: 50%;
  border: 1px solid
    ${({ theme }: any) => theme.palette?.borderColor.main};
  cursor: pointer;
  text-align: center;
  z-index: 2;
  & > div {
    border-color: ${darken(0.2)('#d8e1ef')};
  }
`;

export const CollapseIconArrow = styled('div') <any>`
  border: solid #8e97a7;
  border-width: 0 2px 2px 0;
  display: inline-block;
  top: 2px;
  right: 4px;
  height: 8px;
  min-width: 8px;
  position: relative;
  transform: rotate(-135deg);

  &.down {
    top: -2px;
    transform: rotate(45deg);
  }
  &.right {
    transform: rotate(-45deg);
    left: -2px;
  }
  &.left {
    transform: rotate(135deg);
    left: 2px;
  }
`;
