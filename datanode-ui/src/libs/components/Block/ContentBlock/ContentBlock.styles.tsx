import { styled } from '@mui/material/styles';

export const BlockBaseHeadContent = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
  /* background-color: ${({ theme }: any) =>
    theme.palette?.backgroundColor.main}; */
  padding: 0 16px;
  height: 50px;
  color: ${({ theme }: any) => theme.palette?.textColor.header};

  border-radius: ${({ theme }: any) => theme.shape.borderRadius}px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  .collapsible-content-block__title-text {
    font-size: 16px;
    font-weight: 500;
  }
  &.content-visible::after {
    content: '';
    display: block;
    left: 16px;
    bottom: 0;
    position: absolute;
    width: calc(100% - 32px);
    border-bottom: 1px solid
      ${({ theme }: any) => theme.palette?.borderColor.main + 80};
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
`;
