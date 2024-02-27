import styled from "@emotion/styled";

export const TimeContainer: any = styled.div`
font-size: 13px;
.date {
  white-space: nowrap;
}
.time {
  color: ${({ theme }: any) => theme.palette.textColor.label};
}
`;