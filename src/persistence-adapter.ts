export abstract class PersistenceAdapter<T> {
    abstract setItem(key: string, value: T): void;

    abstract getItem(key: string): T;
}
