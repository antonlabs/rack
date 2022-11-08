import {BehaviorSubject, filter, Observable} from "rxjs";
import {AsyncPersistenceAdapter, PersistenceAdapter} from "./persistence-adapter";
import {LocalStorageAdapter} from "./std-adapter/local-storage-adapter";
import {Rack} from "./rack";

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
        content.then(data => this.sub.next(this.loadContentFromCache(JSON.parse(data))));
      }else if(content) {
        return this.loadContentFromCache(JSON.parse(content));
      }
    }
    return this.onCreate();
  }

  loadContentFromCache(content: any): any {
    const result: any = {};
    Object.keys(content).forEach((key: any) => {
      console.log('content', content[key]);
      if(content[key].startsWith("#")) {
        const stripPersistenceKey = content[key].slice(1);
        const instance = Rack.metadata[stripPersistenceKey]();
        if(instance) {
          instance.set(content[key]);
          result[key] = instance;
        }
      }else {
        result[key] = content[key];
      }
    })
    return result;
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
      if(value[key] instanceof State) {
        objectWithoutNestedStates[key] = `#${value[key].persistenceKey}`;
      }else {
        objectWithoutNestedStates[key] = value[key];
      }
    }
    return JSON.stringify(objectWithoutNestedStates);
  }

  get val(): T {
    return this.sub.value ?? this.onCreate();
  }

  set(value: Partial<T> | any) {
    const actualValue = JSON.parse(this.toJsonString() ?? {});
    this.sub.next({...actualValue, ...value});
  }

  abstract onCreate(): T;
  abstract refreshState(): Promise<void>;

}
