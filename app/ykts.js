
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
		await contract.methods.addAdmin(new_admin).send({from: current_admin})
		.then(function(receipt){
			response = receipt;
		});
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
		await contract.methods.renounceAdmin().send({from: current_admin})
		.then(function(receipt){
			response = receipt;
		});
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
		await contract.methods.addNotary(new_notary).send({from: current_admin})
		.then(function(receipt){
			response = receipt;
		});
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
		await contract.methods.removeNotary(removed_notary).send({from: current_admin})
		.then(function(receipt){
			response = receipt;
		});
	} catch (e) {
		console.error("[xyz_ykts_remove_notary] " + e.message);
		return null;
	}
	return response;
}

// sign message
export async function xyz_ykts_sign(contract, owner, msg_hash) {
	var eth_hash = null;
	var signature = null;
	try {
		if (contract.methods == null) {
			console.error("[xyz_ykts_sign] contract invalid");
			return null;
		}
		// format message hash for eth_sign compatability (recover() needs this)
		eth_hash = await contract.methods.hashToSign(msg_hash).call();
		// sign formatted hash
		signature = await web3.eth.sign(eth_hash, owner);
	} catch (e) {
		console.error("[xyz_ykts_sign] " + e.message);
		return null;
	}
	return signature;
}

// recover the signer address from message hash
export async function xyz_ykts_recover(contract, msg_hash, signature) {
	var eth_hash = null;
	var address = null;
	try {
		if (contract.methods == null) {
			console.error("[xyz_ykts_recover] contract invalid");
			return null;
		}
		// format message hash for eth_sign compatability (recover() needs this)
		eth_hash = await contract.methods.hashToSign(msg_hash).call();
		// recover signer address
		address = await contract.methods.recover(eth_hash, signature).call();
	} catch (e) {
		console.error("[xyz_ykts_recover] " + e.message);
		return null;
	}
	return address;
}

// request broker approval
export async function xyz_ykts_broker_request(contract, address, id, msg_hash, signature) {
	var response = null;
	try {
		if (contract.methods == null) {
			console.error("[xyz_ykts_broker_request] contract invalid");
			return null;
		}
		await contract.methods.requestBrokerApproval(id, msg_hash, signature).send({from: address})
		.then(function(receipt){
			response = receipt;
		});
	} catch (e) {
		console.error("[xyz_ykts_broker_request] " + e.message);
		return null;
	}
	return response;
}

// approve broker request (only allowed to notaries)
export async function xyz_ykts_add_broker(contract, current_notary, broker) {
	var response = null;
	try {
		if (contract.methods == null) {
			console.error("[xyz_ykts_add_broker] contract invalid");
			return null;
		}
		await contract.methods.addBroker(broker).send({from: current_notary})
		.then(function(receipt){
			response = receipt;
		});
	} catch (e) {
		console.error("[xyz_ykts_add_broker] " + e.message);
		return null;
	}
	return response;
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
