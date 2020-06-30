import { xyz_create_web3_provider, xyz_get_account_by_index, xyz_get_network_name, xyz_get_provider_name, xyz_get_accounts } from './common.js';
import { xyz_ykts_get_contract, xyz_ykts_add_admin  } from './ykts.js';

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

	list_admins: async () => {
		var self = this;
		document.getElementById("admin_status").innerHTML = "Pending";
		document.getElementById("admin_count").innerHTML = 0;
		document.getElementById("admin_addresses").innerHTML = 0;

		// get admin count
		const count = await ykts_contract.methods.getAdminCount().call();
		console.log("Admin Count:", count)

		var addrs = [];
		for (var i = 0; i < count; i++) {
			addrs[i] = await ykts_contract.methods.getAdmin(i).call();
		}
		console.log("Admin Addresses:", addrs)

		document.getElementById("admin_status").innerHTML = "OK";
		document.getElementById("admin_count").innerHTML = count;
		document.getElementById("admin_addresses").innerHTML = addrs;
	},

	add_admin: async () => {
		var self = this;
		document.getElementById("add_admin_status").innerHTML = "Pending";
		// get new admin address
		const new_admin_address = document.getElementById('new_admin_address')
		if (!new_admin_address) {
			document.getElementById("add_admin_status").innerHTML = "Failed";
			alert("Empty admin address!");
			return;
		}
		const address = new_admin_address.value;

		// get tx sender address (current admin!)
		const sender_address = await xyz_get_account_by_index(0);
		if (sender_address == null) {
			document.getElementById("add_admin_status").innerHTML = "Failed";
			alert("Unable to get default address, aborting!");
			return;
		}
		// add admin
		const response = await xyz_ykts_add_admin(ykts_contract, sender_address, address);
		console.log("Admin Add:", response);
		// OK
		document.getElementById("add_admin_status").innerHTML = "OK";
	},

	renounce_admin: async () => {
		var self = this;
		document.getElementById("renounce_admin_status").innerHTML = "Pending";
		// get tx sender address (current admin!)
		const sender_address = await xyz_get_account_by_index(0);
		if (sender_address == null) {
			document.getElementById("renounce_admin_status").innerHTML = "Failed";
			alert("Unable to get default address, aborting!");
			return;
		}
		// add admin
		const response = await xyz_ykts_add_admin(ykts_contract, sender_address, address);
		console.log("Admin Renounce:", response);
		// OK
		document.getElementById("renounce_admin_status").innerHTML = "OK";
	},
};

// hooking up web3 provider
window.addEventListener('load', async () => {
	xyz_create_web3_provider();
	App.start();
});
