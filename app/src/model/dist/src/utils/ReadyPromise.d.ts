export type ReadyPromise<T> = {
    promise: Promise<T>;
    ready: boolean;
    resolve: (value?: T) => void;
};
export declare const getPromise: <T>(implementation?: () => Promise<T>) => ReadyPromise<T>;
