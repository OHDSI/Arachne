import styled from '@emotion/styled';

export const HeaderChip: any = styled.div`
  font-size: 10px;
  display: inline-block;
  margin-left: 8px;
  background: #ffffff;
  padding: 5px 7px;
  color: ${({ theme }: any) => theme.palette?.primary.main};
`;

export const SubmissionHeader = styled('div')(({ theme }: any) => ({
  display: 'flex',
  flexDirection: 'column',
  fontSize: 24,
  fontWeight: 300,
  paddingBottom: 0,
}));

export const SubmissionHeaderItem = styled.div<any>`
  font-size: ${props => (props.smallFont ? '12px' : '24px')};
  /* margin-left: 10px; */
`;
