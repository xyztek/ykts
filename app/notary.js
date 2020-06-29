import { xyz_get_contract, xyz_ykts_add_notary, xyz_ykts_broker_request, xyz_ykts_recover, xyz_ykts_is_signer, xyz_ykts_sign, xyz_create_web3_provider, xyz_get_balance, xyz_get_account_by_index, xyz_get_network_name, xyz_get_provider_name } from './common.js';

// default account
var ykts_contract;

window.App = {
	start: async () => {
		var self = this;

		// get provider name
		const provider = await xyz_get_provider_name();
		if (provider === null) {
				alert("Couldn't get any Web3 providers, probably Metamask/Mist/Infura is not present!");
				return;
		}
		// check Metamask availability and report
		if (web3.currentProvider.isMetaMask) {
			document.getElementById("providernote").innerHTML = "Metamask is available, please set network to Rinkeby!"
		} else {
			document.getElementById("providernote").innerHTML = "Metamask is NOT available, please use a local node or set 'infuraAPIKey' and connect to Rinkeby network! Some functionality will not work without Metamask";
		}
		// get network name
		const network = await xyz_get_network_name();
		if (network === null) {
			alert("Couldn't get any the Ethereum network, probably Metamask/Mist/Infura is not present!");
			return;
		}

		// parse contract and get abi & address
		var contractvars = await xyz_get_contract("YKTS.json");
		const contract_address = contractvars[0];
		const contract_abi = contractvars[1];
		// create smart contract
		ykts_contract = new web3.eth.Contract(contract_abi, contract_address);

	},

	list_brokers: async () => {
		var self = this;
		document.getElementById("brokerrequeststatus").innerHTML = "Pending";
		document.getElementById("brokerqueuelength").innerHTML = 0;
		document.getElementById("brokeraddresses").innerHTML = 0;

		// sign hash of message with default account
		const address = await xyz_get_account_by_index(0);

		const h = await xyz_ykts_add_notary(ykts_contract, address);
		console.log("hey: ", h);


		// broker queue length
		const length = await ykts_contract.methods.getBrokerQueueLength().call();
		console.log("Broker Length: ", length)

		var addresses;
		for (var i = 0; i < length; i++) {
			addresses[i] = await ykts_contract.methods.getBrokerQueueAt(i).call();
		}
		console.log("Broker Addresses: ", addresses)

		document.getElementById("brokerrequeststatus").innerHTML = response.status;
		document.getElementById("brokerqueuelength").innerHTML = length;
		document.getElementById("brokeraddresses").innerHTML = addresses;

	},

};


// hooking up web3 provider
window.addEventListener('load', async () => {
	xyz_create_web3_provider();
	App.start();
});
