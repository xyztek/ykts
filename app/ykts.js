
// return YKTS contract object
export async function xyz_ykts_get_contract() {
	const contract_name = 'YKTS.json';
	// parse compiled smart contract JSON
	var contract_json;
	$.ajax({
		url: contract_name,
		dataType: 'json',
		async: false,
		data: {},
		success: function(data) {
			contract_json = data;
		},
		error: function (error) {
			console.error("[xyz_ykts_get_contract] JSON request");
			return null;
		}
	});
	if (contract_json == null) {
		console.error("[xyz_ykts_get_contract] contract empty");
		return null;
	}
	// get smart contract address and ABI
	var network_id;
	var contract_address;
	var contract_abi;
	try {
		// get network id
		network_id = await web3.eth.net.getId();
		// get smart contract address & abi
		if (contract_json.networks[network_id.toString()] == null) {
			console.error("[xyz_ykts_get_contract] network invalid");
			return null;
		}
		contract_address = contract_json.networks[network_id.toString()].address;
		contract_abi = contract_json.abi;
	} catch (e) {
		console.error("[xyz_ykts_get_contract] " + e.message);
		return null;
	}
	// log
	console.log(contract_name, "Address:", contract_address);
	console.log(contract_name, "ABI:", contract_abi);
	// return YKTS contract object
	const contract = new web3.eth.Contract(contract_abi, contract_address);
	return contract;
}

// add admin (only allowed to admins)
export async function xyz_ykts_add_admin(contract, current_admin, new_admin) {
	var response = null;
	try {
		if (contract.methods == null) {
			console.error("[xyz_ykts_add_admin] contract invalid");
			return null;
		}
		response = await contract.methods.addAdmin(new_admin).send({from: current_admin});
	} catch (e) {
		console.error("[xyz_ykts_add_admin] " + e.message);
		return null;
	}
	return response;
}

// renounce admin priviliges
export async function xyz_ykts_renounce_admin(contract, current_admin) {
	var response = null;
	try {
		if (contract.methods == null) {
			console.error("[xyz_ykts_renounce_admin] contract invalid");
			return null;
		}
		response = await contract.methods.renounceAdmin().send({from: current_admin});
	} catch (e) {
		console.error("[xyz_ykts_renounce_admin] " + e.message);
		return null;
	}
	return response;
}

// add notary (only allowed to admins)
export async function xyz_ykts_add_notary(contract, current_admin, new_notary) {
	var response = null;
	try {
		if (contract.methods == null) {
			console.error("[xyz_ykts_add_notary] contract invalid");
			return null;
		}
		response = await contract.methods.addNotary(new_notary).send({from: current_admin});
	} catch (e) {
		console.error("[xyz_ykts_add_notary] " + e.message);
		return null;
	}
	return response;
}

// remove notary (only allowed to admins)
export async function xyz_ykts_remove_notary(contract, current_admin, removed_notary) {
	var response = null;
	try {
		if (contract.methods == null) {
			console.error("[xyz_ykts_remove_notary] contract invalid");
			return null;
		}
		response = await contract.methods.removeNotary(removed_notary).send({from: current_admin});
	} catch (e) {
		console.error("[xyz_ykts_remove_notary] " + e.message);
		return null;
	}
	return response;
}



export async function xyz_ykts_broker_request(address, id, msg_hash, signature) {
	// parse contract and get abi & address
	var contractvars = await xyz_get_contract("YKTS.json");
	const contract_address = contractvars[0];
	const contract_abi = contractvars[1];
	// create smart contract
	const contract = new web3.eth.Contract(contract_abi, contract_address);

	// request for approval
	const response = await contract.methods.requestBrokerApproval(id, msg_hash, signature).send({from: address});
	return response;
}


export async function xyz_ykts_sign(msg_hash, address) {
	// parse contract and get abi & address
	var contractvars = await xyz_get_contract("YKTS.json");
	const contract_address = contractvars[0];
	const contract_abi = contractvars[1];
	// create smart contract
	const contract = new web3.eth.Contract(contract_abi, contract_address);

	// format message hash for eth_sign compatability (recover() needs this)
	const eth_hash = await contract.methods.hashToSign(msg_hash).call();
	// sign formatted hash
	const signature = await web3.eth.sign(eth_hash, address);
	return signature;
}

export async function xyz_ykts_is_signer(owner, hash, signature) {
	// parse contract and get abi & address
	var contractvars = await xyz_get_contract("YKTS.json");
	const contract_address = contractvars[0];
	const contract_abi = contractvars[1];
	// create smart contract
	const contract = new web3.eth.Contract(contract_abi, contract_address);

	// check if 'hash' is signed by the 'owner'
	const result = await contract.methods.isSigner(owner, hash, signature).call();
	return result;
}

export async function xyz_ykts_recover(hash, signature) {
	// parse contract and get abi & address
	var contractvars = await xyz_get_contract("YKTS.json");
	const contract_address = contractvars[0];
	const contract_abi = contractvars[1];
	// create smart contract
	const contract = new web3.eth.Contract(contract_abi, contract_address);

	// convert to Ethereum hash
	const ehash = await contract.methods.hashToSign(hash).call();
	// recover signer address
	const address = await contract.methods.recover(ehash, signature).call();
	return address;
}
