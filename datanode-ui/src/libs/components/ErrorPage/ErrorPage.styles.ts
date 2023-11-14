import styled from '@emotion/styled';
import { darken, transparentize } from 'polished';


export const StatusHeader = styled.div`
  font-size: 70px;
  font-weight: 800;
  color: ${({ theme }: any) =>
    darken(0.1, theme.palette?.backgroundColor?.main || '#F7F8FA')};
  margin-right: 8px;
`;

export const StatusDescription = styled.div`
  font-size: 28px;
  font-weight: 800;
  /* margin-bottom: 50px; */
  color: ${({ theme }: any) => {
    return transparentize(0.1, theme.palette?.textColor?.label || '#798395');
  }};
`;

export const MessageErrorPage = styled.div`
  font-size: 20px;
  padding: 0 40px;
  /* margin-bottom: 16px; */
  color: ${({ theme }: any) =>
    theme.palette?.textColor?.label || '#798395'};
`;
