import React, { useState } from "react";
import { useRouter } from "next/router";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import getFactory from "../../utils/factory";
import { isWalletConnected, connectWallet } from "../../utils/web3Utils";

const CampaignNew = () => {
    const [minimumContribution, setMinimumContribution] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const setMinimumContributionValue = (event) => {
        const { value } = event.target;
        setMinimumContribution(value);
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
            const account = await connectWallet();
            const factory = await getFactory();
            await factory.methods.deployCampaign(minimumContribution).send({
                from: account,
            });

            router.push("/");
        } catch (e) {
            setErrorMessage(e.message);
        }

        setLoading(false);
    };

    return (
        <Layout>
            <h3>Create a Campaign</h3>
            <Form onSubmit={onSubmit} error={!!errorMessage}>
                <Form.Field>
                    <label>Minimum contribution</label>
                    <Input
                        label="wei"
                        labelPosition="right"
                        value={minimumContribution}
                        onChange={setMinimumContributionValue}
                    />
                </Form.Field>

                <Message error header="Oops" content={errorMessage} />
                <Button primary loading={loading}>
                    Create!
                </Button>
            </Form>
        </Layout>
    );
};

export default CampaignNew;
