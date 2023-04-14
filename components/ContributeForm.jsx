import React, { useState } from "react";
import { useRouter } from "next/router";
import { Form, Button, Input, Message } from "semantic-ui-react";
import getCampaign from "../utils/campaign";
import { connectWallet, isWalletConnected, getWeb3 } from "../utils/web3Utils";

const ContributeForm = (props) => {
    const [contribution, setContribution] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { campaignAddress } = props;

    const setContributionValue = (event) => {
        const { value } = event.target;
        setContribution(value);
    };

    const onSubmit = async (event) => {
        if (!(await isWalletConnected())) {
            router.push("/");
            return;
        }

        event.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            const web3 = getWeb3();
            const account = await connectWallet();
            const campaign = await getCampaign(campaignAddress);

            await campaign.methods.contribute().send({
                from: account,
                value: web3.utils.toWei(contribution, "ether"),
            });

            router.reload(`/campaigns/${campaignAddress}`);
        } catch (e) {
            setErrorMessage(e.message);
        }

        setLoading(false);
    };

    return (
        <Form onSubmit={onSubmit} error={!!errorMessage}>
            <Form.Field>
                <label>Amount to contribute</label>
                <Input label="ether" labelPosition="right" value={contribution} onChange={setContributionValue} />
            </Form.Field>

            <Message error header="Oops" content={errorMessage} />
            <Button primary loading={loading}>
                Contribute!
            </Button>
        </Form>
    );
};

export default ContributeForm;
