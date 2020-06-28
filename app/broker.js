import { xyz_get_contract, xyz_ykts_recover, xyz_ykts_is_signer, xyz_ykts_sign, xyz_create_web3_provider, xyz_get_balance, xyz_get_account_by_index, xyz_get_network_name, xyz_get_provider_name } from './common.js';

// default account
var account;

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
	},

	broker_request: async () => {
		var self = this;
		document.getElementById("brokerrequeststatus").innerHTML = "Pending";
		document.getElementById("brokeraddress").innerHTML = 0;
		document.getElementById("brokerid").innerHTML = 0;
		document.getElementById("brokerhash").innerHTML = 0;
		document.getElementById("brokersignature").innerHTML = 0;

		const brokerid = document.getElementById('brokerappid')
		if (!brokerid) {
			alert("Empty Id!");
			return;
		}
		const id = brokerid.value;

		const brokermessage = document.getElementById('brokermessage')
		if (!brokermessage) {
			alert("Empty message!");
			return;
		}
		const message = brokermessage.value;
		console.log("Broker Message:", message);
		// calculate hash of message
		const hash = web3.utils.sha3(message);
		console.log("Broker Hash:", hash);

		// sign hash of message with default account
		const address = await xyz_get_account_by_index(0);
		const signature = await xyz_ykts_sign(hash, address);
		console.log("Broker Signature: ", signature);

		// recover signer address
		const recover = await xyz_ykts_recover(hash, signature);
		console.log("Broker Recover: ", recover);

		if (address != recover) {
			alert("Address/Recover mismatch!");
			return;
		}

		document.getElementById("brokerrequeststatus").innerHTML = "Pending";
		document.getElementById("brokeraddress").innerHTML = address;
		document.getElementById("brokerid").innerHTML = id;
		document.getElementById("brokerhash").innerHTML = hash;
		document.getElementById("brokersignature").innerHTML = signature;
	},

};


// hooking up web3 provider
window.addEventListener('load', async () => {
	xyz_create_web3_provider();
	App.start();
});
