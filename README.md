## Altoros Dapp Test

### Goal

Create a DApp that allows people to vote on a (binary) proposal. Each ethereum address should be allowed to vote only once and the vote should cost 0.01 ETH.

When a user opens the page, it should see the result so far (number of positive votes vs. number of negative votes). Real-time updating is a bonus, but not required.

The app should consist only of a frontend. It should work in Rinkeby and with MetaMask.

The contract is already deployed at `0x9b7ae666ec5d51c793379612344fac224f29f733`. You can see it [here](https://rinkeby.etherscan.io/address/0x9b7ae666ec5d51c793379612344fac224f29f733#code).

Feel free to ask any clarifying questions you may have.

### Stack and tools required

The only requirements are to use React for the frontend. Everything else is up to you. We recommend using [web3-react](https://github.com/NoahZinsmeister/web3-react), but it's not required.

You can get Rinkeby ether [here](https://faucet.rinkeby.io/). Alternatively, in MetaMask import the address `0xc5Ab57Cb50a7e8eECE4190bf95df3014a7589531` with private key `0x0fff86e3cff17fc341c5e3104459807a1133bcf32b8f9e9d3184ec01f8df85a6` which already has 3 ETH loaded.

## Application features

#### Application technical features

+ Node v.10.16.0

+ MetaMask Browser Extension installed

#### Installation

Clone or download the project and run

`npm install`

For develop environment, run:

`npm run start`
 
The default port for localhost is 3000.

For production environment, run:

`npm run build`

The application will be ready for serve in the folder _build_. 

#### Test issues

The contract has a restriction that each account can vote once. If you want to try more than once you can reset the variables with the **clean** method, you can run the clean method by the external _rinkeby_ interface on:

https://rinkeby.etherscan.io/address/0x9b7ae666ec5d51c793379612344fac224f29f733#writeContract

Then 

_Connect with Web3_ > _Write_ 

#### Alternative branch

In the branch _alternative_ there is a version of the contract without the _once vote_'s restriction. You can run this version of the contract on a develop environment. 
