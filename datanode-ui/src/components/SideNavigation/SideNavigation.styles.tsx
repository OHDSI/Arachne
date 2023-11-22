import styled from '@emotion/styled';
import { Button } from '../../libs/components';
import { NavLink } from 'react-router-dom';

export const NavigationContainer = styled.div`
  padding: 0 18px;
  width: 70px;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: ${({ theme }: any) => theme.shadows[2]};
  background-color: #ffffff;
  z-index: 5;
  position: fixed;
  top: 0;
  left: 0;
  /* background: ${(props: any) => {
    return props.theme.palette?.backgroundColor.default || '#ffffff';
  }}; */
`;

export const StyledButton: any = styled(Button)`
  justify-content: space-around;
  align-items: center;
  padding: 6px;
  min-width: auto;
  margin: 8px 0;
  border-radius: 2px;
  .MuiSvgIcon-root {
    font-size: 28px;
  }
`;

export const LogoContainer = styled(NavLink)`
  padding: 12px 0px 16px;
`;

export const InfoContainer = styled.div`
  font-size: 9px;
  color: ${({ theme }: any) => theme.palette?.primary.main};
  padding: 5px 10px;
  position: absolute;
  bottom: 0;
`;
