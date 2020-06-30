import { xyz_create_web3_provider, xyz_get_account_by_index, xyz_get_balance, xyz_get_network_name, xyz_get_provider_name } from './common.js';

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
		// get tx sender address (current admin!)
		const address = await xyz_get_account_by_index(0);
		if (address == null) {
			alert("Unable to get default address, aborting!");
			return;
		}
		// get balance
		const balance = await xyz_get_balance(address);
		if (balance == null) {
			alert("Unable to get address balance, aborting!");
			return;
		}
		// print
		document.getElementById("address").innerHTML = address;		
		document.getElementById("balance").innerHTML = web3.utils.fromWei(balance, 'ether');
	},

  // send ether
  send_ether: function() {
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
	xyz_create_web3_provider();
	App.start();
});
