import { xyz_create_web3_provider, xyz_get_account_by_index, xyz_get_network_name, xyz_get_provider_name } from './common.js';
import { xyz_ykts_get_contract, xyz_ykts_sign, xyz_ykts_is_signer, xyz_ykts_recover } from './ykts.js';

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

	message_test: async () => {
		var self = this;
		document.getElementById("sanityresult").innerHTML = "processing";
		const sanitymessage = document.getElementById('sanitymessage')
		if (!sanitymessage) {
			document.getElementById("sanityresult").innerHTML = "false";
			alert("Empty message!");
			return;
		}
		const message = sanitymessage.value;
		console.log("Test Message:", message);
		// calculate hash of message
		const hash = web3.utils.sha3(message);
		console.log("Test Hash:", hash);
		// sign
		const address = await xyz_get_account_by_index(0);
		const signature = await xyz_ykts_sign(ykts_contract, hash, address);
		console.log("Test Signature: ", signature);
		// verify
		const ret = await xyz_ykts_is_signer(ykts_contract, address, hash, signature);
		console.log("Test Return: ", ret);
		// recover
		const recover = await xyz_ykts_recover(ykts_contract, hash, signature);
		console.log("Test Recover: ", recover);
		// update status
		document.getElementById("sanityresult").innerHTML = ret;
	},

	message_sign: async () => {
		var self = this;
		document.getElementById("yktsmessagehash").innerHTML = 0;
		document.getElementById("yktsmessagesignature").innerHTML = 0;
		document.getElementById("yktssigner").innerHTML = 0;

		const yktsmessage = document.getElementById('yktsmessagetosign')
		if (!yktsmessage) {
			alert("Empty message!");
			return;
		}
		const message = yktsmessage.value;
		console.log("Sign Message:", message);
		// calculate hash of message
		const hash = web3.utils.sha3(message);
		console.log("Sign Hash:", hash);

		// sign hash of message with default account
		const address = await xyz_get_account_by_index(0);
		const signature = await xyz_ykts_sign(ykts_contract, hash, address);
		console.log("Sig Signature: ", signature);

		// recover signer address
		const recover = await xyz_ykts_recover(ykts_contract, hash, signature);
		console.log("Sign Recover: ", recover);

		document.getElementById("yktsmessagehash").innerHTML = hash;
		document.getElementById("yktsmessagesignature").innerHTML = signature;
		document.getElementById("yktssigner").innerHTML = address;
	},

	message_verify: async () => {
		var self = this;
		document.getElementById("yktsverifyresult").innerHTML = "processing";

		const yktsmessagetoverify = document.getElementById('yktsmessagetoverify');
		if (!yktsmessagetoverify) {
			document.getElementById("yktsverifyresult").innerHTML = "false";
			alert("Empty message!");
			return;
		}
		const yktssignaturetoverify = document.getElementById('yktssignaturetoverify');
		if (!yktssignaturetoverify) {
			document.getElementById("yktsverifyresult").innerHTML = "false";
			alert("Empty signature!");
			return;
		}
		const yktsaddresstoverify = document.getElementById('yktsaddresstoverify');
		if (!yktsaddresstoverify) {
			document.getElementById("yktsverifyresult").innerHTML = "false";
			alert("Empty address!");
			return;
		}
		const message = yktsmessagetoverify.value;
		console.log("Verify Message:", message);
		const signature = yktssignaturetoverify.value;
		console.log("Verify Signature: ", signature);
		const address = yktsaddresstoverify.value;

		// calculate hash of message
		const hash = web3.utils.sha3(message);
		// verify the signer for the hash of the message
		const ret = await xyz_ykts_is_signer(ykts_contract, address, hash, signature);
		// recover signer address
		const recover = await xyz_ykts_recoverykts_contract, (hash, signature);
		console.log("Verify Recover: ", recover);

		// update status
		document.getElementById("yktsverifyresult").innerHTML = ret;
	}
};

// hooking up web3 provider
window.addEventListener('load', async () => {
	xyz_create_web3_provider();
	App.start();
});
