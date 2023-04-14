import Web3 from "web3";
import campaignFactory from "./abi/CampaignFactory.json";

const factoryAddress = process.env.factoryAddress;

const getFactory = async () => {
    const { ethereum } = window;
    if (!ethereum) {
        console.log("please install MetaMask");
        return;
    }

    const web3 = new Web3(ethereum);
    const factoryContract = await new web3.eth.Contract(campaignFactory.abi, factoryAddress);
    return factoryContract;
};

export default getFactory;
