export const insertToArray = <T>(array: T[], index: number, item: T) => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

export const removeFromArray = <T>(array: T[], index: number) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const replaceInArray = <T>(array: T[], index: number, item: T) => {
  return [...array.slice(0, index), item, ...array.slice(index + 1)];
};

export const moveInArray = <T>(array: T[], from: number, to: number) => {
  const item = array[from];
  const newArray = removeFromArray(array, from);
  return insertToArray(newArray, to, item);
};
