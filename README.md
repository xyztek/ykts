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

# deploy smart contracts on various networks
$ truffle migrate --network localhost
$ truffle migrate --network mainnet
$ truffle migrate --network ropsten
$ truffle migrate --network rinkeby

# serve static content with lite-server at localhost:3000
$ npm run dev
```
