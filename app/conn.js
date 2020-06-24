import { createWeb3Provider, getNetworkName, getProviderName } from './common.js';

// application
window.App = {
	start: async () => {
		var self = this;

		// fill provider and network details
		const provider = await getProviderName();
		if (provider === null) {
			alert("Couldn't get any Web3 providers, probably Metamask/Mist is not present!");
			return;
		}
		const network = await getNetworkName();
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
	createWeb3Provider();
	App.start();
});
