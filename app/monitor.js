import { xyz_create_web3_provider, xyz_get_account_by_index, xyz_get_network_name, xyz_get_provider_name } from './common.js';
import { xyz_ykts_get_contract } from './ykts.js';

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
		// OK
		document.getElementById("admin_status").innerHTML = "OK";
		document.getElementById("admin_count").innerHTML = count;
		document.getElementById("admin_addresses").innerHTML = addrs;
	},

	list_notaries: async () => {
		var self = this;
		document.getElementById("notary_status").innerHTML = "Pending";
		document.getElementById("notary_count").innerHTML = 0;
		document.getElementById("notary_addresses").innerHTML = 0;

		// get notary count
		const count = await ykts_contract.methods.getNotaryCount().call();
		console.log("Notary Count:", count)

		var addrs = [];
		for (var i = 0; i < count; i++) {
			addrs[i] = await ykts_contract.methods.getNotary(i).call();
		}
		console.log("Notary Addresses:", addrs)
		// OK
		document.getElementById("notary_status").innerHTML = "OK";
		document.getElementById("notary_count").innerHTML = count;
		document.getElementById("notary_addresses").innerHTML = addrs;
	},
};

// hooking up web3 provider
window.addEventListener('load', async () => {
	xyz_create_web3_provider();
	App.start();
});
