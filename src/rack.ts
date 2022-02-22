import {State} from "./state";
import {filter, merge, Observable} from "rxjs";

export class Rack<T> extends State<T> {

    constructor(
        private state: T
    ) {
        super();
    }

    onCreate(): T {
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
