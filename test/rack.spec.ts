import { PersistenceAdapter, Rack, State } from "../src"

const storage: any = {};

class MyTestPersistenceProvider extends PersistenceAdapter<string> {
    setItem(key: string, value: string): void {
        if(typeof value !== 'string') {
            throw new Error("value is not a string");
        }
        storage[key] = value;
    }
    getItem(key: string) {
        return storage[key];
    }
}

interface StateAProperties {
    name: string;
    stateB: StateB
}

class StateA extends State<StateAProperties> {
    onCreate(): StateAProperties {
        return {
            name: 'ciao',
            stateB: new StateB('state-b', new MyTestPersistenceProvider())
        }
    }
    refreshState(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

interface StateBProperties {
    name: string;
    stateC: StateC
}

class StateB extends State<StateBProperties> {
    onCreate(): StateBProperties {
        return {
            name: 'state-b',
            stateC: new StateC('state-c', new MyTestPersistenceProvider())
        }
    }
    refreshState(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

interface StateCProperties {
    name: string;
}

class StateC extends State<StateCProperties> {
    onCreate(): StateCProperties {
        return {
            name: 'prova-c'
        }
    }
    refreshState(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}


test('test init of a rack state', () => {
    const rack = new Rack({
        prova: new StateA('state-a', new MyTestPersistenceProvider())
    }, new MyTestPersistenceProvider());
    rack.val.prova.val.stateB.set({
        name: 'state-corrupted'
    })
    console.log(rack.val.prova.val.stateB.val);
    const rack2 = new Rack({
        prova: new StateA('state-a', new MyTestPersistenceProvider())
    }, new MyTestPersistenceProvider());
    console.log(rack2.val.prova.val.stateB.val);
})
