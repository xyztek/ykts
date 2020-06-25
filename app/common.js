
export async function xyz_get_contract(contract_name) {
	// parse compiled smart contract JSON
	var contract_json;
	$.ajax({
		url: contract_name,
		dataType: 'json',
		async: false,
		data: {},
		success: function(data) {
			contract_json = data;
		},
		error: function (error) {
			return [null, null];
		}
	});
	// get network id
	const networkId = await web3.eth.net.getId()

	const contract_address = contract_json.networks[networkId.toString()].address;
	const contract_abi = contract_json.abi;

	console.log("Smart Contract", contract_name, "Address", contract_address);
	console.log("Smart Contract", contract_name, "ABI", contract_abi);

	return [contract_address, contract_abi];
}

export async function xyz_get_account_by_index(index) {
	var account;
	var accounts;
	try {
		accounts = await web3.eth.getAccounts();
	} catch (e) {
		console.log(e.message);
		return null;
	}
	if (accounts.length == 0) {
		return null;
	}
	// get default account
	account = accounts[index];
	if (web3.utils.isAddress(account) != true) {
		return null;
	}
	console.log("Ethereum Default Account", account);
	return account;
}

export async function xyz_get_accounts() {
	var accounts;
	try {
		accounts = await web3.eth.getAccounts();
	} catch (e) {
		console.log(e.message);
		return null;
	}
	if (accounts.length == 0) {
		return null;
	}
	console.log("Ethereum Accounts", accounts);
	return accounts;
}

export async function xyz_get_balance(walletAddress) {
	try {
		if (web3.utils.isAddress(walletAddress) != true) {
			console.log("invalid Ethereum address");
			return null;
		}
		const balance = await web3.eth.getBalance(walletAddress);
		console.log("Ethereum Balance", balance);
		return balance;
	} catch (e) {
		console.log(e.message);
		return null;
	}
}

export async function xyz_get_network_name() {
	try {
		const network = await web3.eth.net.getNetworkType();
		console.log("Ethereum Network", network);
		return network;
	} catch (e) {
		console.log(e.message);
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

const infura_project_id = "17816af5e26d434aa2f6d52915764ed7";

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
