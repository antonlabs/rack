import {PersistenceAdapter} from "../persistence-adapter";


export class LocalStorageAdapter extends PersistenceAdapter<string | null> {
    getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    setItem(key: string, value: string | null): void {
        localStorage.setItem(key, value ?? '');
    }
}
