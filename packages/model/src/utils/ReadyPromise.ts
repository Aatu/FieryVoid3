export type ReadyPromise<T> = {
  promise: Promise<T>;
  ready: boolean;
  resolve: (value?: T) => void;
};

export const getPromise = <T>(
  implementation?: () => Promise<T>
): ReadyPromise<T> => {
  let resolve = null;

  const promise = new Promise<T>((r) => {
    resolve = r;
  });

  const result = {
    promise,
    ready: false,
    resolve: (v?: T) => {},
  };

  result.resolve = (v?: T) => {
    resolve!(v);
    result.ready = true;
  };

  if (implementation !== undefined) {
    (async () => {
      const value = await implementation();
      result.resolve(value);
      result.ready = true;
    })();
  }

  return result;
};
