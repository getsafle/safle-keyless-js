# **Keyless Transactions - Safle**

This package allows a dapp to enable "Sign In With Safle" as a mechanism to enable their users to interact with the dapp using a custom safle widget and perform transactions using their safle password and pin in a non custodial manner.

## **Keyless Transactions**

Talking about user adoption, the bottleneck faced by most of the dApps is the user onboarding flow. The user needs to have a wallet, generating and operating a wallet is cumbersome for a new crypto user.

Keyless transactions abstracts the private key from the user and allows the user to sign transaction in an easy way while having the same level of security as before.

safle Keyless Transactions allow users to sign transactions via,

1. Password
2. Biometrics A. Fingerprint B. FaceID
3. Device based virtual Hardware Security Module

We have made **password based transaction signing** available for anyone to use, build upon and replicate.

This documentation focuses more on that, more coming soon. If you want to know more and enagage with development, you can email at the address in footnotes.

Happy #BUIDLing

## **Design Principles**

1. **Private Key Abstraction** - SafleID infrastructure never have the visibility of the private key, it's encrypted on the client with the user password(unsalted & unencrypted) and sent to the virtual Hardware Security Module for safe storage.
2. **Password Invisibility** - User password is never exposed in plain text to any of the systems apart from the client.
3. **Non-Custodial Relationship** - User Private Key is always exportable and encrypted version can be deleted (redundant) from the Safle infrastructure.
4. **App Agnostic** - Any application without getting an API key can access SafleID service, password based transaction signing requires special access which can be requested for. (In Alpha Testing).

### Check out the extensive documentation on how to integrate and use Keyless [here]( )

## **Installation and Usage**

> Installation

Install the package by running the command,

```sh
npm install --save @getsafle/keyless-transactions
```

Import the package into your project using,

```js
import { getNetworks, KeylessWeb3 } from '@getsafle/keyless-transactions';
```

## **Functions**

> Get the list of supported chains and networks

```js
const networks = await getNetworks();
```

> Initialising

Initialise the constructor using,

```js
const keyless = new KeylessWeb3({ blockchain });
```

`blockchain` - An array of objects containing supported blockchains from `getNetworks()`.

> Initialize web3 instance

```js
import Web3  from 'web3';

const w3 = new Web3(keyless.provider);
```

> Check the Keyless class connection to a dApp

The following function verifies whether the sdk is connected to the provider or not:

```js
keyless.isConnected();
```

The following function disconnects Web3 from Keyless. It returns true/false if disconnected:

```js
keyless.disconnect();
```

> Initialize the login widget

To initialize the login screen, you have to use the following function:

```js
keyless.login();
```

Event handlers for login status

```js
w3.currentProvider.on('connect', () => {} );
w3.currentProvider.on('disconnect', () => {} );
w3.currentProvider.on('login successful', () => {} );
```

> Chain/Account Selection

The selectChain()command opens the modal for selecting the active chains. The following code triggers chain/address selection

```js
keyless.selectChain();
```

During the chain selection process, Keyless will send chainChanged and accountsChangedevents.

To get the selected account, you can use the web3 functions

```js
const accounts = await w3.eth.getAccounts();
```

Event handler for chain selection

```js
w3.currentProvider.on('chainChanged', () => {} );
```

Event handler for account selection

```js
w3.currentProvider.on('accountsChanged', () => {} );
```

> Open Dashboard

To open the dashboard, you have to make sure that you are logged in. In order for you to do that, you have to use the following command

```js
keyless.isLoggedIn();
```

If the returned result is true, it means that you are logged in, and you can open the dashboard by using the following command

```js
keyless.openDashboard();
```

> Check Balance

You can check the balance using the standard web3 function like

```js
const balance = await w3.eth.getBalance(address);
```

> Perform Transactions

To open the transaction review modal, use the below code,

```js
const resp = await w3.eth.sendTransaction(rawTransactionObject);
```

The `rawTransactionObject` is an object containing the transaction details like the sender, recipient, value, etc.

Event handler for transaction success/failure

```js
w3.currentProvider.on('transactionSuccess', ( receipt ) => {
    console.log('transaction success', receipt );            
});
        
w3.currentProvider.on('transactionFailed', ( receipt ) => {
    console.log('transaction failed', receipt );
});
```

> Sign Messages

To open the sign message modal, use the below code

```js
const signedMessage = await w3.eth.sign( 'Any message', activeAddress );
```

## **WIP**

Want to contribute, we would ❤️ that!

We are a Global 🌏🌍🌎 team! 💪

Write to [dev@getsafle.com](mailto:dev@getsafle.com), or follow us on twitter, [https://twitter.com/getsafle](https://twitter.com/getsafle)
