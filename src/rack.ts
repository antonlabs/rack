import {State} from "./state";
import {filter, merge, Observable} from "rxjs";


export class Rack<T> extends State<T> {
    private metadata: {[key: string]: Function} = {};

    constructor(
        private state: T,
    ) {
        super();
        this.metadata = this.getMetadata(state);
        console.log('metadata', this.metadata);
    }

    getMetadata(input: any): {[key: string]: Function} {
        let result: {[key: string]: Function} = {};
        for(const key of Object.keys(input)) {
            if(input[key] instanceof State) {
                result[key] = input[key].constructor;
                result = {...result, ...this.getMetadata(input[key].val)};
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

