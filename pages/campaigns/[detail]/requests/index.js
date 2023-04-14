/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import Link from "next/link";
import getCampaign from "../../../../utils/campaign";
import RequestRow from "../../../../components/RequestRow";
import { isWalletConnected } from "../../../../utils/web3Utils";

const renderRows = (requestInfo) => {
    return requestInfo.requests.map((request, index) => {
        return (
            <RequestRow
                id={index}
                request={request}
                key={index}
                campaignAddress={requestInfo.campaignAddress}
                approversCount={requestInfo.approversCount}
            />
        );
    });
};

const RequestIndex = () => {
    const { Header, Row, HeaderCell, Body } = Table;
    const [requestInfo, setRequestInfo] = useState({});
    const router = useRouter();
    const campaignAddress = router.query.detail;

    useEffect(() => {
        const init = async () => {
            if (!(await isWalletConnected())) return;
            if (!router.isReady) return;

            const campaign = await getCampaign(campaignAddress);
            const requestCount = await campaign.methods.getRequestCount().call();
            const approversCount = await campaign.methods.approversCount().call();

            const requests = await Promise.all(
                Array(parseInt(requestCount))
                    .fill()
                    .map((element, index) => {
                        return campaign.methods.requests(index).call();
                    })
            );

            setRequestInfo({ campaignAddress, requests, requestCount, approversCount });
        };

        init();
    }, [router.isReady]);

    return (
        <Layout>
            <h3>Requests</h3>
            <Link href={`/campaigns/${campaignAddress}/requests/new`}>
                <Button primary floated="right" style={{ marginBottom: 10 }}>
                    Add Request
                </Button>
            </Link>
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>Id</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>{!_.isEmpty(requestInfo) && renderRows(requestInfo)}</Body>
            </Table>
        </Layout>
    );
};

export default RequestIndex;
