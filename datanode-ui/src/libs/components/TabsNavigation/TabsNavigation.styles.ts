import styled from '@emotion/styled';
import { darken } from 'polished';

export const TabsContainer = styled.div`
  display: flex;
  background: ${({ theme }: any) => theme.palette.backgroundColor.main};
  /* box-shadow: ${({ theme }: any) => theme.customShadows[2]}; */
  border: 1px solid ${({ theme }: any) => theme.palette.borderColor.main};
  border-radius: ${({ theme }: any) => theme.shape.borderRadius}px;
`;

export const TabContainer = styled.div`
  font-size: 14px;
  color: #3c3c3c;
  &:first-of-type .item-tab {
    border-top-left-radius: ${({ theme }: any) => theme.shape.borderRadius}px;
    border-bottom-left-radius: ${({ theme }: any) =>
      theme.shape.borderRadius}px;
  }
  a {
    cursor: pointer;
  }
  .item-tab {
    display: block;
    padding: 10px 15px;
    &:hover:not(.active) {
      background: ${({ theme }: any) =>
        darken(0.02, theme.palette.backgroundColor.main)};
    }
  }
  .active {
    background: ${({ theme }: any) => theme.palette.backgroundColor.header};
    color: #ffffff;
  }
`;
