import {State} from "./state";
import {filter, merge, Observable} from "rxjs";

export type StoreState = {[key: string]: State<any>};

export class Rack<T extends StoreState> extends State<StoreState> {

    constructor(
        private state: T
    ) {
        super();
    }

    onCreate(): StoreState {
        return this.state;
    }

    get states(): T {
        return this.state;
    }

    get obs(): Observable<any> {
        return merge(Object.keys(this.state).map(key => this.state[key].obs)).pipe(
            filter((val) => val !== undefined)
        ) as Observable<any>;
    }

    async refreshState(): Promise<void> {
        for(const key of Object.keys(this.state)) {
            this.state[key].refreshState();
        }
    }
}
