import { createWeb3Provider, getEtherBalance, getAccountByIndex, getNetworkName, getProviderName } from './common.js';

// default account
var account;

window.App = {
	start: async () => {
		var self = this;

		// get provider name
		const provider = await getProviderName();
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
		const network = await getNetworkName();
		if (network === null) {
			alert("Couldn't get any the Ethereum network, probably Metamask/Mist/Infura is not present!");
			return;
		}
		// get default account
		account = await getAccountByIndex(0);
		if (account === null) {
			alert("Couldn't get the default Ethereum accounts, probably Metamask/Mist/Infura is not present!");
			return;
		}
		document.getElementById("defaultaddress").innerHTML = account;

		// get balance
		const balance = await getEtherBalance(account);
		if (balance === null) {
			document.getElementById("etherbalanceauto").innerHTML = "invalid";
		} else {
			document.getElementById("etherbalanceauto").innerHTML = web3.utils.fromWei(balance, 'ether');
		}
	},

  // send ether
  sendEther: function() {
    var self = this;
    let amount = parseFloat(document.getElementById("ethamount").value);
    if (isNaN(amount)) {
      document.getElementById("sendethstatus").innerHTML = "error: invalid amount";
      return;
    }
    let toAddress = document.getElementById("toaddress").value;
    if (web3.utils.isAddress(toAddress) != true) {
      document.getElementById("sendethstatus").innerHTML = "error: invalid sending address";
      return;
    }

    // update status before sending the transaction
    document.getElementById("sendethstatus").innerHTML = "Initiating transaction... (please wait)";

    // send ether to any address from default address
    web3.eth.sendTransaction({from:account, to:toAddress, value:web3.toWei(amount, "ether")}, function(error, transactionHash) {
      if (!error) {
        document.getElementById("sendethstatus").innerHTML = "Transaction sent with hash: " + transactionHash;
        // update balance
        self.getEtherBalance(account, "etherbalanceauto");
      } else {
        document.getElementById("sendethstatus").innerHTML = error;
      }
    });
  },

  // send ERC20 token


};

// hooking up web3 provider
window.addEventListener('load', async () => {
  createWeb3Provider();
	App.start();
});
