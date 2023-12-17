export const setTime = (
  date: Date,
  hours: number,
  minutes: number,
  seconds: number,
) => {
  const newDate = new Date(date);
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(seconds);
  return newDate;
};

export const addDays = (date: Date, days: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export const formatDate = (date: Date) => {
  const pad = (n: number, digit = 2) => n.toString().padStart(digit, '0');

  const year = pad(date.getFullYear(), 4);
  const month = pad(date.getMonth() + 1); // 0-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const formatPastRelativeDate = (diff: number) => {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (diff < minute) {
    return '今さっき';
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)}分前`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}時間前`;
  }

  if (diff < week) {
    return `${Math.floor(diff / day)}日前`;
  }

  if (diff < month) {
    return `${Math.floor(diff / week)}週間前`;
  }

  if (diff < year) {
    return `${Math.floor(diff / month)}ヶ月前`;
  }

  return `${Math.floor(diff / year)}年前`;
};

export const formatFutureRelativeDate = (diff: number) => {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;

  if (diff < minute) {
    return '1分以内';
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)}分後`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}時間後`;
  }

  if (diff < week) {
    return `${Math.floor(diff / day)}日後`;
  }

  return `${Math.floor(diff / week)}週間後`;
};

export const formatRelativeDate = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff > 0
    ? formatPastRelativeDate(diff)
    : formatFutureRelativeDate(-diff);
};

export const toISOStringWithTZ = (date: Date): string => {
  const pad = function (str: string): string {
    return ('0' + str).slice(-2);
  };
  const year = date.getFullYear().toString();
  const month = pad((date.getMonth() + 1).toString());
  const day = pad(date.getDate().toString());
  const hour = pad(date.getHours().toString());
  const min = pad(date.getMinutes().toString());
  const sec = pad(date.getSeconds().toString());
  const tz = -date.getTimezoneOffset();
  const sign = tz >= 0 ? '+' : '-';
  const tzHour = pad((tz / 60).toString());
  const tzMin = pad((tz % 60).toString());
  return `${year}-${month}-${day}T${hour}:${min}:${sec}${sign}${tzHour}:${tzMin}`;
};
