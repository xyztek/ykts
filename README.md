# YKTS Ethereum DApp and Smart Contract(s)


## Contents

This repository contains sample YKTS DApp and smart contracts developed for Ethereum platform. All smart contracts are deployed on Ethereum's **Rinkeby** testnet. [Metamask](https://metamask.io) browser extension is used for testing and development  
Please check out the `*.js` files in `app` directory. By setting `infuraAPIKey` (see [Infura](https://infura.io)) variable you may execute most of the tests without needing Metamask/Mist  

* Ethereum network access via web3 provider may be checked using `app/conn.*` files


## Setting Up

Please refer to the following step-by-step guides to setup and start development with Truffle  

* [How to setup Truffle for macOS and Linux](docs/README.00-truffle.md)
* [How to build Geth on macOS and Linux](docs/README.01-geth.md)


## Development and Testing

Basic commands for development and testing are as follows

```sh
# everytime you had a fresh checkout, get dependencies via
$ npm install

# compile smart contracts
$ truffle compile

# test smart contracts
$ truffle test

# create an .env file to store wallet seed and infura api keys in project root dir
$ cat .env
MNEMONIC=<wallet seed phrases (may be Metamask)>
INFURA_API_KEY=<infura api key>

# deploy smart contracts on Rinkeby (used for testing!)
$ truffle migrate --network rinkeby

# deploy smart contracts on various networks
$ truffle migrate --network localhost
$ truffle migrate --network mainnet
$ truffle migrate --network ropsten

# serve static content with lite-server at localhost:3000
$ npm run dev
```

A sample migration will look as follows, current smart contract cost is `0.0518081 ETH`

```sh
$ truffle migrate --network rinkeby

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Migrations dry-run (simulation)
===============================
> Network name:    'rinkeby-fork'
> Network id:      4
> Block gas limit: 10000000 (0x989680)


1_initial_migration.js
======================

   Deploying 'YKTS'
   ----------------
   > block number:        6768436
   > block timestamp:     1593682018
   > account:             0x6119AB391d0A2870D4e97E83a8aFe7FbFb558400
   > balance:             9.205390429
   > gas used:            2515405 (0x2661cd)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.00503081 ETH

   -------------------------------------
   > Total cost:          0.00503081 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.00503081 ETH





Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 10000000 (0x989680)


1_initial_migration.js
======================

   Deploying 'YKTS'
   ----------------
   > transaction hash:    0x1538dbfe787624e059b07018f8d724330bcc91c57f7800ad25f3ea619262466c
   > Blocks: 0            Seconds: 8
   > contract address:    0x8A395c8c418A67A3cb0eafd2285c26c8710cf9C2
   > block number:        6768438
   > block timestamp:     1593682044
   > account:             0x6119AB391d0A2870D4e97E83a8aFe7FbFb558400
   > balance:             9.158613139
   > gas used:            2590405 (0x2786c5)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0518081 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:           0.0518081 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.0518081 ETH
```