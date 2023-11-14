import { Button } from '../../Button/Button';
import styled, { StyledComponent } from '@emotion/styled';
import { Select } from '../../Select/Select';

export const PaginationStyled: StyledComponent<any> = styled.div`
  text-align: right;
  font-family: ${({ theme }: any) =>
    theme.typography?.fontFamily || 'sans-serif'};
  font-size: ${({ theme }: any) => theme.typography?.fontSize || 13}px;
  line-height: 22px;
  & .dots {
    display: inline-block;
    cursor: default;
    padding: 2px 8px;
  }
  & span {
    font-size: 0.8rem;
  }
`;

export const ButtonStyled: StyledComponent<any> = styled(Button)`
  min-width: auto;
  padding: 0 4px;
  min-width: 22px;
  height: 22px;
  margin: 0 2px;
  font-weight: 400;
  &.active {
    background-color: ${({ theme }: any) => theme.palette?.info.main + 15};
  }
`;

export const StyledSelect: StyledComponent<any> = styled(Select)`
  margin-left: 10;
`;
