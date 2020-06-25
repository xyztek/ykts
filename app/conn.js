import { xyz_create_web3_provider, xyz_get_network_name, xyz_get_provider_name } from './common.js';

// application
window.App = {
	start: async () => {
		var self = this;

		// fill provider and network details
		const provider = await xyz_get_provider_name();
		if (provider === null) {
			alert("Couldn't get any Web3 providers, probably Metamask/Mist is not present!");
			return;
		}
		const network = await xyz_get_network_name();
		if (network === null) {
			alert("Couldn't get any the Ethereum network, probably Metamask/Mist is not present!");
			return;
		}

		// show on page
		document.getElementById("providername").innerHTML = provider;
		document.getElementById("networkname").innerHTML = network;
	},
};

// hooking up web3 provider
window.addEventListener('load', async () => {
	xyz_create_web3_provider();
	App.start();
});
