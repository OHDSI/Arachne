import React from 'react';
import styled from '@emotion/styled';
import { getFormatDateAndTime } from '../../../utils/getFormatDate';

const DateContainer: any = styled.div`
  font-size: 13px;
  .date {
    white-space: nowrap;
  }
  .time {
    color: ${({ theme }: any) => theme.palette.textColor.label};
  }
`;

export const DateCell: React.FC<any> = (props: any) => {
  const value = (() => {
    try {
      return getFormatDateAndTime(props.value);
    } catch (e) {
      console.error('WRONG DATE TIME FORMAT, value:', props.value, e);
      return null;
    }
  })();

  return (
    <DateContainer>
      {value ? (
        <>
          <div className="date">{value}</div>
          {/* <div className="time">{value.time}</div> */}
        </>
      ) : (
        '-'
      )}
    </DateContainer>
  );
};
