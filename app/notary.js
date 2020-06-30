import { xyz_create_web3_provider, xyz_get_account_by_index, xyz_get_network_name, xyz_get_provider_name } from './common.js';
import { xyz_ykts_get_contract, xyz_ykts_add_broker } from './ykts.js';

// YKTS contract interface
var ykts_contract;

window.App = {
	start: async () => {
		var self = this;

		// get provider name
		const provider = await xyz_get_provider_name();
		if (provider == null) {
				alert("Couldn't get any Web3 providers, probably Metamask/Mist/Infura is not present!");
				return;
		}
		const network_name = await xyz_get_network_name();
		if (network_name == null) {
			alert("Couldn't get Ethereum network name, aborting!");
			return;
		}
		// check Metamask availability and report
		if (web3.currentProvider.isMetaMask) {
			document.getElementById("note").innerHTML = "Metamask is available and Ethereum network is set to '" + network_name + "'";
		} else {
			document.getElementById("note").innerHTML = "Metamask is NOT available, aborting!";
			return;
		}
		// parse contract and get abi & address
		ykts_contract = await xyz_ykts_get_contract();
		if (ykts_contract == null) {
			alert("Unable to get ./build/YKTS.json smart contract on '" + network_name + "' network, aborting!");
			return;
		}
	},

	approve_broker: async () => {
		var self = this;
		document.getElementById("approve_broker_status").innerHTML = "Pending";
		document.getElementById("approve_broker_sender").innerHTML = 0;

		// get tx sender address (current admin!)
		const sender_address = await xyz_get_account_by_index(0);
		if (sender_address == null) {
			document.getElementById("approve_broker_status").innerHTML = "Failed";
			alert("Unable to get default address, aborting!");
			return;
		}
		const new_broker_address = document.getElementById('new_broker_address').value;
		if (!new_broker_address) {
			document.getElementById("approve_broker_status").innerHTML = "Failed";
			document.getElementById("approve_broker_sender").innerHTML = sender_address;
			alert("Empty Broker Address!");
			return;
		}
		// request for approval
		const response = await xyz_ykts_add_broker(ykts_contract, sender_address, new_broker_address);
		if (!response) {
			document.getElementById("broker_request_status").innerHTML = "Failed";
			document.getElementById("approve_broker_sender").innerHTML = sender_address;
			alert("Approval request failed!");
			return;
		}
		console.log("Notary Response: ", response);
		// OK
		document.getElementById("approve_broker_status").innerHTML = response.status;
		document.getElementById("approve_broker_sender").innerHTML = sender_address;
	},
};

// hooking up web3 provider
window.addEventListener('load', async () => {
	xyz_create_web3_provider();
	App.start();
});
