/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useRouter } from "next/router";
import { Button, Card, Grid } from "semantic-ui-react";
import Link from "next/link";
import Layout from "../../../components/Layout";
import getCampaign from "../../../utils/campaign";
import ContributeForm from "../../../components/ContributeForm";
import { isWalletConnected, getWeb3 } from "../../../utils/web3Utils";

const renderCards = (campaignSummary) => {
    const { balance, manager, minimumContribution, requestCount, approversCount } = campaignSummary;

    const items = [
        {
            header: manager,
            meta: "Address of manager",
            description: "The manager created this campaign and can create requests to withdraw money",
            style: { overflowWrap: "break-word" },
        },
        {
            header: minimumContribution.toString(),
            meta: "Minimum contribution",
            description: "You must contribute at least this much wei to become an approver",
        },
        {
            header: requestCount.toString(),
            meta: "Number of requests",
            description: "A request tries to withdraw money from the contract. Requests must be approved by approvers",
        },
        {
            header: approversCount.toString(),
            meta: "Number of approvers",
            description: "Number of people who have already donated to this campaign",
        },
        {
            header: balance.toString(),
            meta: "Campaign balance (ether)",
            description: "The balance is how much money this campaign has left to spend",
        },
    ];

    return <Card.Group items={items} />;
};

const CampaignIndex = () => {
    const [campaignSummary, setCampaignSummary] = useState({});
    const router = useRouter();
    const campaignAddress = router.query.detail;

    useEffect(() => {
        const init = async () => {
            if (!(await isWalletConnected())) return;
            if (!router.isReady) return;

            const web3 = getWeb3();
            const campaign = await getCampaign(campaignAddress);
            const summary = await campaign.methods.getSummary().call();

            const campaignSummary = {
                minimumContribution: summary[0],
                balance: web3.utils.fromWei(summary[1], "ether"),
                requestCount: summary[2],
                approversCount: summary[3],
                manager: summary[4],
                address: campaignAddress,
            };
            setCampaignSummary(campaignSummary);
        };

        init();
    }, [router.isReady]);

    return (
        <Layout>
            <h3>Campaign detail</h3>
            <Grid>
                <Grid.Column width={10}>
                    {!_.isEmpty(campaignSummary) && renderCards(campaignSummary)}
                    <Link href={`/campaigns/${campaignAddress}/requests`}>
                        <Button primary style={{ marginTop: 10 }}>
                            View Requests
                        </Button>
                    </Link>
                </Grid.Column>
                <Grid.Column width={6}>
                    <ContributeForm campaignAddress={campaignAddress} />
                </Grid.Column>
            </Grid>
        </Layout>
    );
};

export default CampaignIndex;
