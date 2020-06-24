
let infuraProjectId = "17816af5e26d434aa2f6d52915764ed7";

export async function getAccounts() {
	try {
		const accounts = await web3.eth.getAccounts();
		if (accounts.length == 0) {
			return null;
		}
		console.log("Ethereum Accounts", accounts);
		return accounts;
	} catch (error) {
		return null;
	}
}

export async function getEtherBalance(walletAddress) {
	try {
		const balance = await web3.eth.getBalance(walletAddress);
		console.log("Ethereum Balance", balance);
		return balance;
	} catch (error) {
		return null;
	}
}

export async function getNetworkName() {
	try {
		const network = await web3.eth.net.getNetworkType();
		console.log("Ethereum Network", network);
		return network;
	} catch (error) {
		return null;
	}
}

// copied from https://ethereum.stackexchange.com/questions/24266/elegant-way-to-detect-current-provider-int-web3-js
export async function getProviderName() {
	if (window.web3.currentProvider.isMetaMask)
		return 'metamask';
	if (window.web3.currentProvider.isTrust)
		return 'trust';
	if (typeof window.SOFA !== 'undefined')
		return 'toshi';
	if (typeof window.__CIPHER__ !== 'undefined')
		return 'cipher';
	if (window.web3.currentProvider.constructor.name === 'EthereumProvider')
		return 'mist';
	if (window.web3.currentProvider.constructor.name === 'Web3FrameProvider')
		return 'parity';
	if (window.web3.currentProvider.host && window.web3.currentProvider.host.indexOf('infura') !== -1)
		return 'infura';
	if (window.web3.currentProvider.host && window.web3.currentProvider.host.indexOf('localhost') !== -1)
		return 'localhost';
	return null;
}

export async function createWeb3Provider() {
	// Modern dapp browsers...
	if (window.ethereum) {
		console.log('Modern DApp Browser Detected! ' + web3.currentProvider.constructor.name)
		window.web3 = new Web3(ethereum);
		try {
			// Request account access if needed
			await ethereum.enable();
			// Acccounts now exposed
		} catch (error) {
			// User denied account access...
		}
	}
	// Legacy dapp browsers...
	else if (window.web3) {
		console.log('Legacy DApp Browser Detected! ' + web3.currentProvider.constructor.name)
		window.web3 = new Web3(web3.currentProvider);
		// Acccounts always exposed
	}
	// Non-dapp browsers...
	else {
		// fallback - infura or localhost
		if (!infuraProjectId || infuraProjectId === "") {
			// use local node
			console.log('No Web3 Detected... trying Geth')
			window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		} else {
			// use Infura
			console.log('No Web3 Detected... trying Infura (on Rinkeby)')
			window.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/" + infuraProjectId));
		}
	}
}