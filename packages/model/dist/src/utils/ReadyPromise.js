export const getPromise = (implementation) => {
    let resolve = null;
    const promise = new Promise((r) => {
        resolve = r;
    });
    const result = {
        promise,
        ready: false,
        resolve: (v) => { },
    };
    result.resolve = (v) => {
        resolve(v);
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
