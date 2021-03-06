
// get account (address) by index, Metamask only returns one though!
export async function xyz_get_account_by_index(index) {
	var account;
	var accounts;
	try {
		accounts = await web3.eth.getAccounts();
	} catch (e) {
		console.error("[xyz_get_account_by_index]" + e.message);
		return null;
	}
	if (accounts.length == 0) {
		console.error("[xyz_get_account_by_index] accounts empty");
		return null;
	}
	if (index >= accounts.length || index < 0) {
		console.error("[xyz_get_account_by_index] index invalid");
		return null;
	}
	// get default account
	account = accounts[index];
	if (web3.utils.isAddress(account) != true) {
		console.error("[xyz_get_account_by_index] accounts empty");
		return null;
	}
	return account;
}

// get all accounts, Metamask only returns one though!
export async function xyz_get_accounts() {
	var accounts;
	try {
		accounts = await web3.eth.getAccounts();
	} catch (e) {
		console.error("[xyz_get_accounts]" + e.message);
		return null;
	}
	if (accounts.length == 0) {
		console.error("[xyz_get_accounts] accounts empty");
		return null;
	}
	return accounts;
}

// get account balance
export async function xyz_get_balance(address) {
	try {
		if (web3.utils.isAddress(address) != true) {
			console.error("[xyz_get_balance] address invalid");
			return null;
		}
		const balance = await web3.eth.getBalance(address);
		return balance;
	} catch (e) {
		console.error("[xyz_get_balance]" + e.message);
		return null;
	}
}

// get network name
export async function xyz_get_network_name() {
	try {
		const network = await web3.eth.net.getNetworkType();
		return network;
	} catch (e) {
		console.error("[xyz_get_network_name]" + e.message);
		return null;
	}
}

// get Ethereum network id
export async function xyz_get_network_id() {
	try {
		const id = await web3.eth.net.getId()
		return id;
	} catch (e) {
		console.error("[xyz_get_network_id]" + e.message);
		return null;
	}
}

// copied from https://ethereum.stackexchange.com/questions/24266/elegant-way-to-detect-current-provider-int-web3-js
export async function xyz_get_provider_name() {
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

// Infura Project Id
const infura_project_id = "";

export async function xyz_create_web3_provider() {
	// Modern dapp browsers...
	if (window.ethereum) {
		console.log('Modern DApp Browser Detected! ' + web3.currentProvider.constructor.name)
		window.web3 = new Web3(ethereum);
		try {
			// Request account access if needed
			await ethereum.enable();
			// Acccounts now exposed
		} catch (e) {
			// User denied account access...
			console.log(e.message);
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
		if (!infura_project_id || infura_project_id === "") {
			// use local node
			console.log('No Web3 Detected... trying Geth')
			window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		} else {
			// use Infura
			console.log('No Web3 Detected... trying Infura (on Rinkeby)')
			window.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/" + infura_project_id));
		}
	}
}
