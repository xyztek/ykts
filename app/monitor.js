import { xyz_create_web3_provider, xyz_get_account_by_index, xyz_get_network_name, xyz_get_provider_name } from './common.js';
import { xyz_ykts_get_contract, xyz_ykts_broker_queue, xyz_ykts_entity_queue } from './ykts.js';

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

	list_entities: async () => {
		var self = this;
		document.getElementById("entity_status").innerHTML = "Pending";
		document.getElementById("entity_count").innerHTML = 0;
		document.getElementById("entity_addresses").innerHTML = 0;

		// get notary count
		const count = await ykts_contract.methods.getEntityCount().call();
		console.log("Entity Count:", count)

		var addrs = [];
		for (var i = 0; i < count; i++) {
			addrs[i] = await ykts_contract.methods.getEntity(i).call();
		}
		console.log("Entity Addresses:", addrs)
		// OK
		document.getElementById("entity_status").innerHTML = "OK";
		document.getElementById("entity_count").innerHTML = count;
		document.getElementById("entity_addresses").innerHTML = addrs;
	},

	list_brokers: async () => {
		var self = this;
		document.getElementById("broker_status").innerHTML = "Pending";
		document.getElementById("broker_count").innerHTML = 0;
		document.getElementById("broker_addresses").innerHTML = 0;

		// get notary count
		const count = await ykts_contract.methods.getBrokerCount().call();
		console.log("Broker Count:", count)

		var addrs = [];
		for (var i = 0; i < count; i++) {
			addrs[i] = await ykts_contract.methods.getBroker(i).call();
		}
		console.log("Broker Addresses:", addrs)
		// OK
		document.getElementById("broker_status").innerHTML = "OK";
		document.getElementById("broker_count").innerHTML = count;
		document.getElementById("broker_addresses").innerHTML = addrs;
	},

	list_entity_queue: async () => {
		var self = this;
		document.getElementById("entity_queue_status").innerHTML = "Pending";
		document.getElementById("entity_queue_count").innerHTML = 0;
		document.getElementById("entity_queue_addresses").innerHTML = 0;

		// get brokers in queue
		const entities_in_queue = await xyz_ykts_entity_queue(ykts_contract);
		if (entities_in_queue == null) {
			alert("Entities in queue is null");
			return;
		}
		console.log("Entities Queue Count:", entities_in_queue.length);
		console.log("Entities Queue Addresses:", entities_in_queue);
		// OK
		document.getElementById("entity_queue_status").innerHTML = "OK";
		document.getElementById("entity_queue_count").innerHTML = entities_in_queue.length;
		document.getElementById("entity_queue_addresses").innerHTML = entities_in_queue;
	},

	list_broker_queue: async () => {
		var self = this;
		document.getElementById("broker_queue_status").innerHTML = "Pending";
		document.getElementById("broker_queue_count").innerHTML = 0;
		document.getElementById("broker_queue_addresses").innerHTML = 0;

		// get brokers in queue
		const brokers_in_queue = await xyz_ykts_broker_queue(ykts_contract);
		if (brokers_in_queue == null) {
			alert("Brokers in queue is null");
			return;
		}
		console.log("Broker Queue Count:", brokers_in_queue.length);
		console.log("Broker Queue Addresses:", brokers_in_queue);
		// OK
		document.getElementById("broker_queue_status").innerHTML = "OK";
		document.getElementById("broker_queue_count").innerHTML = brokers_in_queue.length;
		document.getElementById("broker_queue_addresses").innerHTML = brokers_in_queue;
	},
};

// hooking up web3 provider
window.addEventListener('load', async () => {
	xyz_create_web3_provider();
	App.start();
});
