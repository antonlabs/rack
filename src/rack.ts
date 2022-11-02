import {State} from "./state";
import {filter, merge, Observable} from "rxjs";
import { AsyncPersistenceAdapter, PersistenceAdapter } from "./persistence-adapter";
import { LocalStorageAdapter } from "./std-adapter/local-storage-adapter";

export class Rack<T> extends State<T> {

    constructor(
        private state: T,
    ) {
        super();
        super.persistenceAdapter.setItem('rack.lock', JSON.stringify(this.getMetadata(state as any)));
    }

    getMetadata(input: any): {[key: string]: string} {
        let result: {[key: string]: string} = {};
        for(const key of Object.keys(input)) {
            if(input[key] instanceof State) {
                result[key] = input[key].constructor.name;
                result = {...result, ...this.getMetadata(result[key])};
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

