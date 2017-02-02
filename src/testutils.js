// eslint-disable-next-line import/prefer-default-export
export const toBlob = (value, selector = x => JSON.stringify(x, null, 2), type = 'application/json') =>
  new Blob([selector(value)], { type });

export const log = (...args) => (result) => {
  console.log(...args, result); // eslint-disable-line no-console

  return result;
};

export const resolveAt = (resolver, timeout) =>
  new Promise(resolve => setTimeout(() => resolve(resolver()), timeout));
