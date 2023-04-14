/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Button, Segment, Grid } from "semantic-ui-react";
import Link from "next/link";
import Layout from "../components/Layout";
import getFactory from "../utils/factory";
import { isWalletConnected, connectWallet } from "../utils/web3Utils";

function renderCampaigns(campaigns) {
    const items = campaigns.map((address) => {
        return {
            header: address,
            description: <Link href={`/campaigns/${address}`}>View campaign</Link>,
            fluid: true,
        };
    });

    return <Card.Group items={items} />;
}

const CampaignIndex = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [currentAccount, setCurrentAccount] = useState("");

    const onAccountChange = async (accounts) => {
        if (accounts.length == 0) return;
        const account = await connectWallet();
        setCurrentAccount(account);
    };

    const setUp = async () => {
        const account = await connectWallet();
        setCurrentAccount(account);

        if (!(await isWalletConnected())) return;

        const factory = await getFactory();
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        setCampaigns(campaigns);

        const { ethereum } = window;
        ethereum.on("accountsChanged", async function (accounts) {
            onAccountChange(accounts);
        });

        return factory;
    };

    useEffect(() => {
        const init = async () => {
            if (!(await isWalletConnected())) return;
            await setUp();
        };

        init();

        return () => {
            console.log("unload");
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", onAccountChange);
            }
        };
    }, []);

    return (
        <div>
            {currentAccount ? (
                <Layout>
                    <div>
                        <h3>Open Campaigns</h3>
                        <Link href="/campaigns/new">
                            <Button floated="right" content="Create campaign" icon="add circle" primary />
                        </Link>
                        {renderCampaigns(campaigns)}
                    </div>
                </Layout>
            ) : (
                <Segment>
                    <Grid>
                        <Grid.Column textAlign="center">
                            <Button onClick={setUp}> Connect your wallet </Button>
                        </Grid.Column>
                    </Grid>
                </Segment>
            )}
        </div>
    );
};

CampaignIndex.getInitialProps = async () => {
    return { nodata: true };
};

export default CampaignIndex;
