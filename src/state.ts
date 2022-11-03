import {BehaviorSubject, filter, Observable} from "rxjs";
import {AsyncPersistenceAdapter, PersistenceAdapter} from "./persistence-adapter";
import {LocalStorageAdapter} from "./std-adapter/local-storage-adapter";

export abstract class State<T> {
  protected sub: BehaviorSubject<T> = new BehaviorSubject<T>(
    this.fromLocalStorage()
  );

  constructor(
      private persistenceKey?: string,
      protected persistenceAdapter: PersistenceAdapter<any> | AsyncPersistenceAdapter<any> = new LocalStorageAdapter()
  ) {}

  fromLocalStorage(): T {
    if(this.persistenceKey) {
      const content = this.persistenceAdapter.getItem(this.persistenceKey);
      if(content instanceof Promise) {
        content.then(data => this.sub.next(data));
      }else if(content) {
        return JSON.parse(content);
      }
    }
    return this.onCreate();
  }

  get obs(): Observable<T> {
    return this.sub.pipe(filter((val) => val !== undefined)) as Observable<T>;
  }

  async store(): Promise<void> {
    if(this.persistenceKey) {
      for(const value of Object.values(this.val as any)) {
        if(value instanceof State) {
          await value.store();
        }
      }
      await this.persistenceAdapter.setItem(this.persistenceKey, this.toJsonString());
    }else {
      throw new Error('You have to set persistence key in state constructor to store a state');
    }
  }

  toJsonString(): string {
    const value: any = this.sub.value;
    const objectWithoutNestedStates: any = {};
    for(const key of Object.keys(value)) {
      if(!(value[key] instanceof State)) {
        objectWithoutNestedStates[key] = value[key];
      }
    }
    return JSON.stringify(objectWithoutNestedStates);
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
