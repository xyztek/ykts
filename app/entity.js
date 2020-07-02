import { xyz_create_web3_provider, xyz_get_account_by_index, xyz_get_network_name, xyz_get_provider_name } from './common.js';
import { xyz_ykts_get_contract, xyz_ykts_sign, xyz_ykts_recover, xyz_ykts_entity_request } from './ykts.js';

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

	entity_request: async () => {
		var self = this;
		document.getElementById("entity_request_status").innerHTML = "Pending";
		document.getElementById("entity_address").innerHTML = 0;
		document.getElementById("entity_id").innerHTML = 0;
		document.getElementById("entity_hash").innerHTML = 0;
		document.getElementById("entity_signature").innerHTML = 0;

		// get tx sender address (current admin!)
		const sender_address = await xyz_get_account_by_index(0);
		if (sender_address == null) {
			document.getElementById("entity_request_status").innerHTML = "Failed";
			alert("Unable to get default address, aborting!");
			return;
		}
		const id = document.getElementById('entity_appid').value;
		if (!id) {
			document.getElementById("entity_request_status").innerHTML = "Failed";
			document.getElementById("entity_address").innerHTML = sender_address;
			alert("Empty Id!");
			return;
		}
		const message = document.getElementById('entity_message').value;
		if (!message) {
			document.getElementById("entity_request_status").innerHTML = "Failed";
			document.getElementById("entity_address").innerHTML = sender_address;
			alert("Empty message!");
			return;
		}
		var proxies = [];
		const entity_proxy0 = document.getElementById('entity_proxy0').value;
		if (!entity_proxy0) {
			document.getElementById("entity_request_status").innerHTML = "Failed";
			document.getElementById("entity_address").innerHTML = sender_address;
			alert("Empty Proxy0!");
			return;
		}
		const entity_proxy1 = document.getElementById('entity_proxy1').value;
		const entity_proxy2 = document.getElementById('entity_proxy2').value;
		// create a proxy array
		proxies[0] = entity_proxy0;
		if (entity_proxy1) {
			proxies[1] = entity_proxy1;
		}
		if (entity_proxy2) {
			proxies[2] = entity_proxy2;
		}
		console.log("Entity Proxies:", proxies);

		console.log("Entity Message:", message);
		// calculate hash of message
		const hash = web3.utils.sha3(message);
		console.log("Entity Hash:", hash);

		const signature = await xyz_ykts_sign(ykts_contract, sender_address, hash);
		console.log("Entity Signature: ", signature);

		// recover signer address
		const recover = await xyz_ykts_recover(ykts_contract, hash, signature);
		console.log("Entity Recover: ", recover);

		if (sender_address != recover) {
			document.getElementById("entity_request_status").innerHTML = "Failed";
			document.getElementById("entity_address").innerHTML = sender_address;
			alert("Address/Recover mismatch!");
			return;
		}
		// request for approval
		const response = await xyz_ykts_entity_request(ykts_contract, sender_address, id, hash, signature, proxies);
		if (!response) {
			document.getElementById("entity_request_status").innerHTML = "Failed";
			document.getElementById("entity_address").innerHTML = sender_address;
			alert("Approval request failed!");
			return;
		}
		console.log("Entity Response: ", response);

		document.getElementById("entity_request_status").innerHTML = response.status;
		document.getElementById("entity_address").innerHTML = sender_address;
		document.getElementById("entity_id").innerHTML = id;
		document.getElementById("entity_hash").innerHTML = hash;
		document.getElementById("entity_signature").innerHTML = signature;
	},

};


// hooking up web3 provider
window.addEventListener('load', async () => {
	xyz_create_web3_provider();
	App.start();
});
