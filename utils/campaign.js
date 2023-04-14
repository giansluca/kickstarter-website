import Web3 from "web3";
import campaign from "./abi/Campaign.json";

const getCampaign = async (address) => {
    const { ethereum } = window;
    if (!ethereum) {
        console.log("please install MetaMask");
        return;
    }

    const web3 = new Web3(ethereum);
    const campaignContract = new web3.eth.Contract(campaign.abi, address);
    return campaignContract;
};

export default getCampaign;
