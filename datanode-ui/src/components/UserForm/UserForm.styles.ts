import styled, { StyledComponent } from '@emotion/styled';
import { Avatar } from '@mui/material';

export const CurrentUser: StyledComponent<any> = styled.div`
  color: #fff;
  font-size: 14px;
`;

export const AccountName: StyledComponent<any> = styled.div`
  display: flex;
  align-items: center;
  color: #ffffff;
`;

export const LogoutIcon: StyledComponent<any> = styled.div`
  line-height: 14px;

  svg {
    padding: 0 12px 0 24px;
    cursor: pointer;
    font-size: 18px;
  }
`;

export const AccountAction: StyledComponent<any> = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const UserAvatar: StyledComponent<any> = styled(Avatar)`
  width: 30px;
  height: 30px;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 16px;
  & {
    color: ${({ theme }: any) => theme.palette.primary.main};
  }
  background-color: ${({ theme }: any) => theme.palette.secondary.main};
`;
