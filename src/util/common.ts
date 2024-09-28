import moment from 'moment-timezone';

export const dateFormate = (date: Date) => {
  return moment(date).format('DD/MM/YYYY');
};

export const dateUtcFormate = (date: Date) => {
  return moment(date).utc().toDate();
};

export const dateTimeFormateForMail = (date: Date) => {
  return moment.tz(date, 'Asia/Calcutta').format('ddd, Do MMMM YYYY');
};
