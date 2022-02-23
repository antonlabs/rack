# Rack
Rack it's a simple and pluggable state manager based on reactive concepts

#Key concepts
The key concepts that Rack implements are:
- History managements of your application's global states
- States are observable by default
- Pluggable persistent layer module
- Hande immutable state concepts

# Getting started

```
npm install @antonlabs/rack
```

## Create your state's model
```typescript 
import {State} from "@antonlabs/rack";


export interface WalletProperties {
   currency: string;
   units: number;
}

export class WalletState extends State<WalletProperties> {

  onCreate(): WalletProperties { // this is used to provide a first implementation of you state
    return {
      currency: undefined,
      units: undefined
    };
  }

  async refreshState(): Promise<void> {}

}

```

#Add to your Rack!

```typescript 
export const appRack = new Rack({
    myWallet: new WalletState('wallet') //wallet argument is the key in the persitent layer that contains the state content
});
```

#Make your app reactive
```typescript
rack.states.myWallet.obs.subscribe(
    (wallet) => {
        //Do a lot of things
    }
);
```

#Edit your state from everywhere
This will auto propagate your changes to all listeners
```typescript
rack.states.myWallet.set({
    currency: 'EUR'
});
```

#Store your state when you want
```typescript
rack.states.myWallet.store()
```

#Change your state's persistent layer with modular Rack's Adapter
Install the adapter package, for example this is the module to use MacOS's keychain

```npm install @antonlabs/rack-keychain-adapter```

You can changing it during instance declaration like the example
```typescript
const rack = new Rack({
    myWallet: new WalletState(
        'wallet', 
        new KeyChainAdapter('anton.finance') //the argument is the domain of our secrets
    )
});
```
