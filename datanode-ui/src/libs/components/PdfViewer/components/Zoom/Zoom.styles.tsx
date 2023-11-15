import styled from '@emotion/styled';
import { transparentize } from 'polished';

export const ZoomContainer = styled.div`
  //background: .;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 10px;
  bottom: 40px;
  padding: 0 4px;
`;

export const ZoomContent = styled.div`
  padding: 6px 0;
`;

export const IconContainer = styled.div<any>`
  padding: 6px;
  border-radius: 50%;
  cursor: pointer;
  :not(:last-of-type) {
    margin-right: 5px;
  }
  &:hover {
    opacity: 1;
    background-color: ${(props: any) =>
      transparentize(0.9, props.theme.palette?.secondary.main)};
  }
  ${({ disabled, theme }) =>
    disabled &&
    `
    .icon {
      color: ${theme.palette?.grey[400]}
    }
    &:hover {
      cursor: default;
      background-color: transparent;
    }
  `}
`;
