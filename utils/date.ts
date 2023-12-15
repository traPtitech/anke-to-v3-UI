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
