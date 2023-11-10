import styled, { StyledComponent } from '@emotion/styled';
import { Spinner } from '../../libs/components/Spinner';

export const LayoutContainer: StyledComponent<any> = styled.div<any>`
  min-height: 100vh;
  width: 100vw;
  max-width: 100%;
  background-color: #ffffff;
`;

export const ContentContainer: StyledComponent<any> = styled.div`
  padding-left: 70px;
`;

export const NavigationSubContainer = styled.div<any>`
  display: flex;
  height: 50px;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  background-color: ${({ theme }: any) => theme.palette.backgroundColor.header};

  /* border-bottom: 1px solid #7b8089; */
  position: relative;
  box-shadow: ${({ theme }: any) => theme.shadows[1]};
  z-index: 4;
  * {
    color: #ffffff;
  }
`;
export const UserActionsContainer = styled.div<any>`
  display: flex;
  height: 60px;
  align-items: center;
  box-sizing: border-box;
  /* box-shadow: ${({ theme }: any) => theme.customShadows[1]}; */
  z-index: 1;
`;

export const EntityContainer: StyledComponent<any> = styled.div`
  height: 100%;
`;

export const PageContainer: StyledComponent<any> = styled.div`
  position: relative;
  min-height: calc(100vh - 50px);
  /* display: flex; */
`;

export const LayoutSpinner: StyledComponent<any> = styled(Spinner)`
  margin-top: 20%;
`;
