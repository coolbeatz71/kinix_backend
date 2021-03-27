export const isEmpty = (value: any): boolean =>
  value === null ||
  value === undefined ||
  value === 'undefined' ||
  (typeof value !== 'number' && value === '') ||
  (value !== null && typeof value === 'object' && !Object.keys(value).length);
