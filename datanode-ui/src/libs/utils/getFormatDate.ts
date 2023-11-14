
import moment from 'moment';
import { DateFormat } from '../enums/DateFormat';

export const getFormatDate = (date: any) => {
  return moment(date).format(DateFormat.DATE);
};

export const getFormatDateAndTime = (date: any) => {
  return moment(date).format(DateFormat.DATE_TIME);
};

export const getFormatDateAndTimeObject = (date: any) => {
  const parsedDate = moment(date);
  return {
    date: parsedDate.format(DateFormat.DATE),
    time: parsedDate.format(DateFormat.TIME),
  };
};

export const getFormatDateFromNow = (date: string) => {
  moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: 'a few seconds',
      ss: '%d seconds',
      m: 'a minute',
      mm: '%d minutes',
      h: 'an hour',
      hh: '%d hours',
      d: 'a day',
      dd: '%d days',
      w: 'a week',
      ww: '%d weeks',
      M: 'a month',
      MM: '%d months',
      y: 'a year',
      yy: '%d years',
    },
  });
  return moment(date).fromNow();
};
