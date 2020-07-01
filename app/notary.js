import { xyz_create_web3_provider, xyz_get_account_by_index, xyz_get_network_name, xyz_get_provider_name } from './common.js';
import { xyz_ykts_get_contract, xyz_ykts_add_broker, xyz_ykts_broker_queue_by_address, xyz_ykts_entity_queue_by_address } from './ykts.js';

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

	search_broker: async () => {
		var self = this;
		document.getElementById("search_broker_status").innerHTML = "Pending";
		document.getElementById("info_search_id").innerHTML = 0;
		document.getElementById("info_search_address").innerHTML = 0;
		document.getElementById("info_search_hash").innerHTML = 0;

		const search_broker_address = document.getElementById('search_broker_address').value;
		if (!search_broker_address) {
			document.getElementById("search_broker_status").innerHTML = "Failed";
			alert("Empty Broker Address!");
			return;
		}
		// get broker in queue by address
		const response = await xyz_ykts_broker_queue_by_address(ykts_contract, search_broker_address);
		if (!response) {
			document.getElementById("search_broker_status").innerHTML = "Failed";
			alert("Search request failed!");
			return;
		}
		const address = response[0];
		const id = response[1];
		const hash = response[2];
		console.log("Search Response: ", response);
		// OK
		document.getElementById("search_broker_status").innerHTML = "OK";
		document.getElementById("info_search_id").innerHTML = id;
		document.getElementById("info_search_address").innerHTML = address;
		document.getElementById("info_search_hash").innerHTML = hash;
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
			document.getElementById("approve_broker_status").innerHTML = "Failed";
			document.getElementById("approve_broker_sender").innerHTML = sender_address;
			alert("Approval request failed!");
			return;
		}
		console.log("Notary Response: ", response);
		// OK
		document.getElementById("approve_broker_status").innerHTML = response.status;
		document.getElementById("approve_broker_sender").innerHTML = sender_address;
	},

	search_entity: async () => {
		var self = this;
		document.getElementById("search_entity_status").innerHTML = "Pending";
		document.getElementById("info_entity_id").innerHTML = 0;
		document.getElementById("info_entity_address").innerHTML = 0;
		document.getElementById("info_entity_hash").innerHTML = 0;

		const search_entity_address = document.getElementById('search_entity_address').value;
		if (!search_entity_address) {
			document.getElementById("search_entity_status").innerHTML = "Failed";
			alert("Empty Entity Address!");
			return;
		}
		// get entity in queue by address
		const response = await xyz_ykts_entity_queue_by_address(ykts_contract, search_entity_address);
		if (!response) {
			document.getElementById("search_entity_status").innerHTML = "Failed";
			alert("Search request failed!");
			return;
		}
		const address = response[0];
		const id = response[1];
		const hash = response[2];
		console.log("Search Response: ", response);
		// OK
		document.getElementById("search_entity_status").innerHTML = "OK";
		document.getElementById("info_entity_id").innerHTML = id;
		document.getElementById("info_entity_address").innerHTML = address;
		document.getElementById("info_entity_hash").innerHTML = hash;
	},

};

// hooking up web3 provider
window.addEventListener('load', async () => {
	xyz_create_web3_provider();
	App.start();
});
