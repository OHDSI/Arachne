import styled from '@emotion/styled';
// import { setLightness } from 'polished';

export const WelcomeContainer: any = styled.div`
  display: flex;
  flex-wrap: wrap;
  h1 {
    padding: 20px 40px;
    color: ${({ theme }: any) => theme.palette?.primary.main};
  }
`;