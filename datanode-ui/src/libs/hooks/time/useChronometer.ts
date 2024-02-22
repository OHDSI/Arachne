import moment from "moment";
import { useEffect, useState } from "react";

const useChronometer = (targetDate: string) => {
  const [timeArray, setTimeArray] = useState<Array<number>>([]);
  const [timeInSeconds, setTimeInSeconds] = useState(
    moment.duration(moment().diff(targetDate)).asSeconds()
  );

  useEffect(() => {
    const interval: any = setInterval(() => {
      setTimeInSeconds((previousState: number) => previousState + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeArray(calculateTimeInSeconds(timeInSeconds));
  }, [timeInSeconds]);

  return timeArray;
};

const calculateTimeInSeconds = (
  timeInSeconds: number
): (number)[] => {
  const hours: number = Math.floor(timeInSeconds / 3600);
  const minutes: number = Math.floor((timeInSeconds - hours * 3600) / 60);
  const seconds: number = Math.floor(
    timeInSeconds - hours * 3600 - minutes * 60
  );
  return [
    hours,
    minutes,
    seconds,
  ];
};
export { useChronometer };