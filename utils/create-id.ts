export const createId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);
