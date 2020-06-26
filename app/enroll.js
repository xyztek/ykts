import { xyz_get_contract, xyz_create_web3_provider, xyz_get_balance, xyz_get_account_by_index, xyz_get_network_name, xyz_get_provider_name } from './common.js';

// default account
var account;
// smart contract
var contract_abi;
var contract_address;

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
		// get default account
		account = await xyz_get_account_by_index(0);
		if (account === null) {
			document.getElementById("defaultaddress").innerHTML = "invalid";
		} else {
			document.getElementById("defaultaddress").innerHTML = account;
		}

		// get balance
		const balance = await xyz_get_balance(account);
		if (balance === null) {
			document.getElementById("etherbalanceauto").innerHTML = "invalid";
		} else {
			document.getElementById("etherbalanceauto").innerHTML = web3.utils.fromWei(balance, 'ether');
		}

		var contractvars = await xyz_get_contract("YKTS.json");
		contract_address = contractvars[0];
		contract_abi = contractvars[1];

		console.log("YKTS Contract Address", contract_address);
		console.log("YKTS Contract ABI", contract_abi);

		//const contract = new web3.eth.Contract(contractJSON.abi, deployedAddress);
		try {
			//const contract = await web3.eth.contract(contract_abi).at(contract_address);
		} catch (e) {
			console.log(e.message);
		}
		
		const contract = new web3.eth.Contract(contract_abi, contract_address);
		console.log("contract: ", contract);

		const msg = "OpenZeppelin";
		const msgHash = web3.utils.sha3(msg);
		console.log("msgHash: ", msgHash);


		const ethHash = await contract.methods.hashToSign(msgHash).call();
		console.log("ethHash: ", ethHash);

	
		var address = await xyz_get_account_by_index(0);
		var signature = await web3.eth.sign(ethHash, address);    // sign the mesage hash
		signature = signature.substr(0, 130) + (signature.substr(130) == "00" ? "1b" : "1c"); // v: 0,1 => 27,28
		var recovered = await contract.methods.isSigner(address, msgHash, signature).call(); // recover from the ethHash
		
		console.log("msgHash: ", msgHash);
		console.log("ethHash: ", ethHash);
		console.log("signature: ", signature);
		console.log("recovered: ", recovered);
		
		//assert.strictEqual(recovered, signer, "The recovered signature does not match the signer.");

	},

	sendEther: async () => {
		var self = this;
		
		console.log("Button pressed");
		
	}

};


// hooking up web3 provider
window.addEventListener('load', async () => {
	xyz_create_web3_provider();
	App.start();
});
