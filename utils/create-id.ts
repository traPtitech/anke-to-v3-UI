export const createId = () =>
  -Date.now() * 10000 - Math.floor(Math.random() * 10000);
