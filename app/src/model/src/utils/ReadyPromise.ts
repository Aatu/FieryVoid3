export type ReadyPromise<T> = { promise: Promise<T>; ready: boolean };

export const getPromise = <T>(
  implementation: () => Promise<T>
): ReadyPromise<T> => {
  let resolve = null;
  let ready: boolean = false;

  const promise = new Promise<T>(async (r) => {
    resolve = r;
  });

  (async () => {
    const result = await implementation();
    resolve!(result);
    ready = true;
  })();

  return { promise, ready };
};
