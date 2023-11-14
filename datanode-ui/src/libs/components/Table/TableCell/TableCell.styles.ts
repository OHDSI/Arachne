import styled from '@emotion/styled';

export const StyledTableCell: any = styled.td`
  padding: 8px;
  /* text-align: left; */
  font-weight: 400;
  font-size: 0.875rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  box-sizing: border-box;
  ${({ maxWidth, isCropped }: any) =>
    isCropped && maxWidth ? `max-width: ${maxWidth}px;` : `max-width: auto;`};
  ${({ minWidth }: any) => (minWidth ? `min-width: ${minWidth}px;` : '')}
  &:first-of-type {
    padding-left: 16px;
  }
  &:last-of-type {
    padding-right: 16px;
  }
`;
