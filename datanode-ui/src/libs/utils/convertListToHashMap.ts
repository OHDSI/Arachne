export const paramsError: string = 'Passed params are not valid!';
export const duplicatesErrorMessage: string = 'Duplicates Found: ';
export const invalidObjectsErrorMessage: string = 'Invalid Objects Found: ';

export function convertListToHashMap<T = Record<string, never>>(
  list: T[],
  key: string,
  omitKey: boolean = false
): Record<string, T> {
  if (!Array.isArray(list) || typeof key !== 'string' || !key)
    throw Error(paramsError);

  const invalidObjects: T[] = [];
  const duplicates: T[] = [];
  const hashMap: Record<string, T> = list.reduce(
    (p: Record<string, T>, c: T) => {
      const hashMapKey = c[key];
      const hashMapKeys = Object.keys(p);
      const isValidHashKey: boolean = ['string', 'number'].includes(
        typeof hashMapKey
      );

      if (!isValidHashKey) {
        invalidObjects.push(c);
        return p;
      }

      if (hashMapKeys.includes(String(hashMapKey))) {
        duplicates.push(c);
        return p;
      }

      if (omitKey) {
        delete c[key];
      }
      p[hashMapKey] = c;

      return p;
    },
    {}
  );

  return hashMap;
}
