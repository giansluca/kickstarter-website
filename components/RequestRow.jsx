import React from "react";
import { useRouter } from "next/router";
import { Button, Table } from "semantic-ui-react";
import getCampaign from "../utils/campaign";
import { connectWallet, isWalletConnected } from "../utils/web3Utils";

const RequestRow = (props) => {
    const router = useRouter();
    const { Row, Cell } = Table;
    const { id, campaignAddress, request, approversCount } = props;
    const readyToFinalize = request.approvalCount > approversCount / 2n;

    async function onApprove() {
        if (!(await isWalletConnected())) {
            router.push("/");
            return;
        }

        const account = await connectWallet();
        const campaign = await getCampaign(campaignAddress);

        await campaign.methods.approveRequest(id).send({
            from: account,
        });
    }

    async function onFinalize() {
        if (!(await isWalletConnected())) {
            router.push("/");
            return;
        }

        const account = await connectWallet();
        const campaign = await getCampaign(campaignAddress);

        await campaign.methods.finalizeRequest(id).send({
            from: account,
        });
    }

    return (
        <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{request.value.toString()}</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell>
                {request.approvalCount.toString()}/{approversCount.toString()}
            </Cell>
            <Cell>
                {request.complete ? null : (
                    <Button color="green" basic onClick={onApprove}>
                        Approve
                    </Button>
                )}
            </Cell>
            <Cell>
                <Button color="teal" basic onClick={onFinalize}>
                    Finalize
                </Button>
            </Cell>
        </Row>
    );
};

export default RequestRow;
