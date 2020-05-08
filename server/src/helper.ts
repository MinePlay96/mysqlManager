/* eslint-disable max-len */
export function firstLevelObject(object: {[name: string]: unknown}): {[key: string]: unknown} {
  const flatObject: {[key: string]: unknown} = {};

  Object.keys(object).forEach(key => {
    const value = object[key];

    if (Object.prototype.toString.call(value) !== '[object Object]') {
      flatObject[key] = value;
    }
  });

  return flatObject;
}
