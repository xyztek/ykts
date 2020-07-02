# YKTS Ethereum DApp and Smart Contract(s)


## Contents

This repository contains sample YKTS DApp and smart contracts developed for Ethereum platform. All smart contracts are deployed on Ethereum's **Rinkeby** testnet. [Metamask](https://metamask.io) browser extension is used for testing and development  
Please check out the `*.js` files in `app` directory.


## Setting Up

Please refer to the following step-by-step guides to setup and start development with Truffle  

* [How to setup Metamask for browsers](docs/README-metamask.md)
* [How to setup Truffle for macOS and Linux](docs/README-truffle.md)
* [How to build Geth on macOS and Linux](docs/README-geth.md)


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
MNEMONIC=<wallet (Metamask) seed phrases>
INFURA_PROJECT_ID==<infura project id>

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
$ truffle migrate --network rinkeby

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Migrations dry-run (simulation)
===============================
> Network name:    'rinkeby-fork'
> Network id:      4
> Block gas limit: 10004062 (0x98a65e)


1_initial_migration.js
======================

   Deploying 'YKTS'
   ----------------
   > block number:        6768719
   > block timestamp:     1593686265
   > account:             0x6119AB391d0A2870D4e97E83a8aFe7FbFb558400
   > balance:             9.153492385
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
   > transaction hash:    0xaf270175c0b0027a26d2ffeb3717fcc17c5c98515aae37e73a26e8cf27acbe0f
   > Blocks: 0            Seconds: 9
   > contract address:    0x2553Cf82F711c808278EA24F39A6678B53f593af
   > block number:        6768721
   > block timestamp:     1593686289
   > account:             0x6119AB391d0A2870D4e97E83a8aFe7FbFb558400
   > balance:             9.106715095
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