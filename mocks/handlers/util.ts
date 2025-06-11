const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

export const oneHourBefore = new Date(Date.now() - 60 * 60 * 1000)
  .toISOString();
export const oneDayBefore = new Date(Date.now() - oneDayInMilliseconds)
  .toISOString();
export const oneDayAfter = new Date(Date.now() + oneDayInMilliseconds)
  .toISOString();
export const twoWeeksAfter = new Date(Date.now() + 14 * oneDayInMilliseconds)
  .toISOString();

export const myUserId = import.meta.env.VITE_MY_USER_ID as string;
if (!myUserId) {
  throw new Error("VITE_MY_USER_ID is not defined in environment variables");
}
