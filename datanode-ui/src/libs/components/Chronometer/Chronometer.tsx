import { useChronometer } from "../../hooks/time";
import { FC, useMemo } from "react";
import { TimeContainer } from "./Chronometer.styles";
import { Tooltip } from "../Tooltip/Tooltip";

export const Chronometer: FC<{ inputDate: string }> = ({ inputDate }: any) => {
  const timeArray = useChronometer(inputDate);

  const displayTime = useMemo(
    () =>
      (timeArray[0] > 1
        ? timeArray[0] + " hours"
        : timeArray[0] === 1
        ? timeArray[0] + " hour"
        : "") +
      " " +
      (timeArray[1] > 1
        ? timeArray[1] + " minutes"
        : timeArray[1] === 1
        ? timeArray[1] + " minute"
        : ""),
    [timeArray]
  );
  return (
    <Tooltip
      placement="right"
      text={timeArray[0] + ":" + timeArray[1] + ":" + timeArray[2]}
      key={inputDate}
      show
    >
      <TimeContainer>{displayTime}</TimeContainer>
    </Tooltip>
  );
};
