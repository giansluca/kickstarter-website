import { Web3 } from "web3";

const isWalletConnected = async () => {
    try {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("please install MetaMask");
            return false;
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length > 0) {
            return true;
        } else {
            console.log("make sure MetaMask is connected");
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

const connectWallet = async () => {
    try {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("please install MetaMask");
            return;
        }

        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
            const account = accounts[0];
            console.log("wallet connected to: " + account);
            return account;
        } else {
            console.log("account size cannot be empty");
        }
    } catch (error) {
        console.log(error);
    }
};

const getWeb3 = () => {
    const { ethereum } = window;
    if (!ethereum) {
        console.log("please install MetaMask");
        return;
    }

    const web3 = new Web3(ethereum);
    return web3;
};

module.exports = {
    isWalletConnected: isWalletConnected,
    connectWallet: connectWallet,
    getWeb3: getWeb3,
};
