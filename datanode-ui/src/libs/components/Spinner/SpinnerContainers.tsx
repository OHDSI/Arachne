import styled from '@emotion/styled';
import { Spinner } from './Spinner';

export const InlineSpinner: any = styled(Spinner)`
  align-self: center;
`;

export const SpinnerContainer = styled.div`
  position: absolute;
  width: calc(100vw - 70px);
  height: calc(100vh - 60px);
  top: 0;
  right: 0;
  background: #eff8fd96;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  z-index: 1000;
`;

export const SpinnerFullContainer = styled.div`
  position: absolute;
  width: calc(100vw);
  height: calc(100vh);
  top: 0;
  right: 0;
  background: #eff8fd96;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  z-index: 1000;
`;

export const SpinnerWidgetContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;