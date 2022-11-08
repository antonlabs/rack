import {State} from "./state";
import {filter, merge, Observable} from "rxjs";
import { AsyncPersistenceAdapter, PersistenceAdapter } from "./persistence-adapter";
import { LocalStorageAdapter } from "./std-adapter/local-storage-adapter";


export class Rack<T> extends State<T> {
    static metadata: {[key: string]: () => State<any>} = {};

    constructor(
        private state: T,
        protected persistenceAdapter: PersistenceAdapter<any> | AsyncPersistenceAdapter<any> = new LocalStorageAdapter()
    ) {
        super(undefined, persistenceAdapter);
        Rack.metadata = this.getMetadata(state);
    }

    getMetadata(input: any, prefix?: string): {[key: string]: () => State<any>} {
        let result: {[key: string]: () => State<any>} = {};
        for(const key of Object.keys(input)) {
            if(input[key] instanceof State && input[key].persistenceKey !== undefined) {
                const persistenceKey = input[key].persistenceKey
                const persistenceAdapter = input[key].persistenceAdapter;
                result[persistenceKey] = () => new input[key].constructor(persistenceKey, persistenceAdapter);
                input[key].persistenceKey = persistenceKey;
                result = {...result, ...this.getMetadata(input[key].val, persistenceKey)};
            }
        }
        return result;
    }

    onCreate(): T {
        return this.state;
    }

    get states(): T {
        return this.state;
    }

    get obs(): Observable<any> {
        const state = this.state as unknown as {[key: string]: State<any>};
        return merge(Object.keys(state).map(key => state[key].obs)).pipe(
            filter((val) => val !== undefined)
        ) as Observable<any>;
    }

    async refreshState(): Promise<void> {
        const state = this.state as unknown as {[key: string]: State<any>};
        for(const key of Object.keys(state)) {
            state[key].refreshState();
        }
    }
}

