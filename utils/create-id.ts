export const createId = () =>
  -Date.now() * 10000 - Math.floor(Math.random() * 10000);

export const createStringId = () =>
  `${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;
