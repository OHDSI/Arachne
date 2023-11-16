import { styled, Theme } from '@mui/material/styles';
// import { Theme } from '../../';

export const BlockTitleStartIcon = styled('div')`
  /* opacity: 0.4; */
  display: inline-block;
  margin-right: 8px;
  margin-top: 4px;
`;
export const BlockTitleText = styled('div')`
  font-weight: 600;
  font-size: 16px;
`;

export const BlockTitleContainer = styled('div')`
  height: 42px;
  min-height: 42px;
  /* background-color: ${({ theme }: any) => theme.palette.backgroundColor.main}; */
  color: ${({ theme }: any) => theme.palette.primary.main};
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid #d0d7de;
  border-top-left-radius: ${(props: any) =>
    props.theme.shape?.borderRadius || 0}px;
  border-top-right-radius: ${(props: any) =>
    props.theme.shape?.borderRadius || 0}px;

  /* button,
  svg {
    color: #fff;
  } */
`;
