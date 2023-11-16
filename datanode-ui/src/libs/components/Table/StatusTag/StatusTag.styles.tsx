import styled, { StyledComponent } from '@emotion/styled';
import { lighten, setLightness } from 'polished';

export const StatusItem: StyledComponent<any> = styled.div<any>`
  display: inline-block;
  padding: 2px 4px;
  height: 16px;
  min-width: 64px;
  text-align: center;
  border-radius: 2px;
  background-color: ${({ color, theme, light }: any) => {
    const COLOR =
      theme.palette?.[color]?.main || color || theme.palette?.grey[700];

    return light ? setLightness(0.9, COLOR) : COLOR;
  }};
  color: ${({ color, theme, light }: any) => {
    const COLOR =
      theme.palette?.[color]?.main || color || theme.palette?.grey[700];
    return light ? COLOR : '#ffffff !important';
  }};
  font-size: 12px;
  font-weight: ${({ light }) => (light ? 600 : 400)};
  line-height: 16px;
  font-weight: 600;
  min-width: 90px;
  cursor: default;

  span {
    display: inline-block;
    margin-right: 3px;
  }
`;
