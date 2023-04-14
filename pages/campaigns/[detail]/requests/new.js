import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Message, Input } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import getCampaign from "../../../../utils/campaign";
import { connectWallet, isWalletConnected, getWeb3 } from "../../../../utils/web3Utils";
import Link from "next/link";

const RequestNew = () => {
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [recipient, setRecipient] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const campaignAddress = router.query.detail;

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

            await campaign.methods
                .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
                .send({ from: account });

            router.push(`/campaigns/${campaignAddress}/requests`);
        } catch (e) {
            setErrorMessage(e.message);
        }

        setLoading(false);
    };

    return (
        <Layout>
            <Link href={`/campaigns/${campaignAddress}/requests`}>
                <Button primary>Back</Button>
            </Link>
            <h3>Create a Request</h3>
            <Form onSubmit={onSubmit} error={!!errorMessage}>
                <Form.Field>
                    <label>Description</label>
                    <Input value={description} onChange={(event) => setDescription(event.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input value={value} onChange={(event) => setValue(event.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input value={recipient} onChange={(event) => setRecipient(event.target.value)} />
                </Form.Field>

                <Message error header="Oops" content={errorMessage} />
                <Button primary loading={loading}>
                    Create!
                </Button>
            </Form>
        </Layout>
    );
};

export default RequestNew;
