export abstract class PersistenceAdapter<T> {
    abstract setItem(key: string, value: T): void;

    abstract getItem(key: string): T;
}

export abstract class AsyncPersistenceAdapter<T> {
    abstract setItem(key: string, value: T): Promise<void>;

    abstract getItem(key: string): Promise<T>;
}
