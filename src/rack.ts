import {State} from "./state";
import {filter, merge, Observable} from "rxjs";

type StoreState = {[key: string]: State<any>};

export class Rack extends State<StoreState> {

    constructor(
        private state: StoreState
    ) {
        super();
    }

    onCreate(): StoreState {
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
