import {BehaviorSubject, filter, Observable} from "rxjs";
import {PersistenceAdapter} from "./persistence-adapter";
import {LocalStorageAdapter} from "./std-adapter/local-storage-adapter";

export abstract class State<T> {
  protected sub: BehaviorSubject<T> = new BehaviorSubject<T>(
    this.fromLocalStorage()
  );

  constructor(
      private persistenceKey?: string,
      private persistenceAdapter: PersistenceAdapter<any> = new LocalStorageAdapter()
  ) {}

  fromLocalStorage(): T {
    if(this.persistenceKey) {
      const content = this.persistenceAdapter.getItem(this.persistenceKey);
      if(content) {
        return JSON.parse(content);
      }
    }
    return this.onCreate();
  }

  get obs(): Observable<T> {
    return this.sub.pipe(filter((val) => val !== undefined)) as Observable<T>;
  }

  store(): void {
    if(this.persistenceKey) {
      this.persistenceAdapter.setItem(this.persistenceKey, JSON.stringify(this.sub.value));
    }else {
      throw new Error('You have to set persistence key in state constructor to store a state');
    }
  }

  get val(): T {
    return this.sub.value ?? this.onCreate();
  }

  set(value: Partial<T> | any) {
    const actualValue = JSON.parse(JSON.stringify(this.sub.value ?? {}));
    this.sub.next({...actualValue, ...value});
  }

  abstract onCreate(): T;
  abstract refreshState(): Promise<void>;

}
