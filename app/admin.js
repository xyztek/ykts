import { xyz_create_web3_provider, xyz_get_account_by_index, xyz_get_network_name, xyz_get_provider_name } from './common.js';
import { xyz_ykts_get_contract, xyz_ykts_add_admin, xyz_ykts_renounce_admin, xyz_ykts_add_notary, xyz_ykts_remove_notary } from './ykts.js';

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

	add_admin: async () => {
		var self = this;
		document.getElementById("add_admin_status").innerHTML = "Pending";
		document.getElementById("add_admin_sender").innerHTML = 0;

		// get tx sender address (current admin!)
		const sender_address = await xyz_get_account_by_index(0);
		if (sender_address == null) {
			document.getElementById("add_admin_status").innerHTML = "Failed";
			alert("Unable to get default address, aborting!");
			return;
		}
		// get new admin address
		const new_admin_address = document.getElementById('new_admin_address').value;
		if (!new_admin_address) {
			document.getElementById("add_admin_status").innerHTML = "Failed";
			document.getElementById("add_admin_sender").innerHTML = sender_address;
			alert("Empty admin address field!");
			return;
		}
		// add admin
		const response = await xyz_ykts_add_admin(ykts_contract, sender_address, new_admin_address);
		// TODO error handling
		console.log("Admin Add:", response);
		// OK
		document.getElementById("add_admin_status").innerHTML = "OK";
		document.getElementById("add_admin_sender").innerHTML = sender_address;
	},

	renounce_admin: async () => {
		var self = this;
		document.getElementById("renounce_admin_status").innerHTML = "Pending";
		document.getElementById("renounce_admin_sender").innerHTML = 0;

		// get tx sender address (current admin!)
		const sender_address = await xyz_get_account_by_index(0);
		if (sender_address == null) {
			document.getElementById("renounce_admin_status").innerHTML = "Failed";
			alert("Unable to get default address, aborting!");
			return;
		}
		// renounce yourself from admin priviliges
		const response = await xyz_ykts_renounce_admin(ykts_contract, sender_address);
		// TODO error handling
		console.log("Admin Renounce:", response);
		// OK
		document.getElementById("renounce_admin_status").innerHTML = "OK";
		document.getElementById("renounce_admin_sender").innerHTML = sender_address;
	},

	add_notary: async () => {
		var self = this;
		document.getElementById("add_notary_status").innerHTML = "Pending";
		document.getElementById("add_notary_sender").innerHTML = 0;

		// get tx sender address (current admin!)
		const sender_address = await xyz_get_account_by_index(0);
		if (sender_address == null) {
			document.getElementById("add_notary_status").innerHTML = "Failed";
			alert("Unable to get default address, aborting!");
			return;
		}
		// get new notary address
		const new_notary_address = document.getElementById('new_notary_address').value;
		if (!new_notary_address) {
			document.getElementById("add_notary_status").innerHTML = "Failed";
			document.getElementById("add_notary_sender").innerHTML = sender_address;
			alert("Empty admin address field!");
			return;
		}
		// add notary
		const response = await xyz_ykts_add_notary(ykts_contract, sender_address, new_notary_address);
		// TODO error handling
		console.log("Notary Add:", response);
		// OK
		document.getElementById("add_notary_status").innerHTML = "OK";
		document.getElementById("add_notary_sender").innerHTML = sender_address;
	},

	remove_notary: async () => {
		var self = this;
		document.getElementById("remove_notary_status").innerHTML = "Pending";
		document.getElementById("remove_notary_sender").innerHTML = 0;

		// get tx sender address (current admin!)
		const sender_address = await xyz_get_account_by_index(0);
		if (sender_address == null) {
			document.getElementById("remove_notary_status").innerHTML = "Failed";
			alert("Unable to get default address, aborting!");
			return;
		}
		// get new notary address
		const remove_notary_address = document.getElementById('remove_notary_address').value;
		if (!remove_notary_address) {
			document.getElementById("remove_notary_status").innerHTML = "Failed";
			document.getElementById("remove_notary_sender").innerHTML = sender_address;
			alert("Empty admin address field!");
			return;
		}
		// add notary
		const response = await xyz_ykts_remove_notary(ykts_contract, sender_address, remove_notary_address);
		// TODO error handling
		console.log("Notary Remove:", response);
		// OK
		document.getElementById("remove_notary_status").innerHTML = "OK";
		document.getElementById("remove_notary_sender").innerHTML = sender_address;
	},
};

// hooking up web3 provider
window.addEventListener('load', async () => {
	xyz_create_web3_provider();
	App.start();
});
