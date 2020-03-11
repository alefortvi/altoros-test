import React, {FunctionComponent, useEffect} from 'react';
import {Button, Col, Container, Row} from 'react-bootstrap';
import Web3 from "web3";
import {PROPOSAL_ADDRESS} from '../../../contracts/Address/contractAddress';
import VoteStats from '../VoteStats/VoteStats';
import './VoteComponent.css';

const proposalAbi = require('../../../contracts/ABI/Proposal.json');

interface OwnProps {}

type Props = OwnProps;

const VoteComponent: FunctionComponent<Props> = () => {


    // connected status
    const [connected, setConnected] = React.useState(false);
    // current account
    const [account, setAccount] = React.useState("");
    // web3 provider
    const [web3Prov, setWeb3Prov] = React.useState(new Web3(Web3.givenProvider));
    // current contract
    const [contract, setContract] = React.useState(new web3Prov.eth.Contract(proposalAbi, PROPOSAL_ADDRESS));
    // Loading state
    const [loading, setLoading] = React.useState(false);
    // Error state
    const [error, setError] = React.useState(false);
    // Error message
    const [errorMsg, setErrorMsg] = React.useState("");
    // Negatives votes count
    const [voteNo, setVoteNo] = React.useState(0);
    // Positives votes count
    const [voteYes, setVoteYes] = React.useState(0);


    // connection setting
    const connect = async () => {
        clearError();
        try {
            setLoading(true);
            const isEtheEnable = await (window as any).ethereum.enable();
            if (isEtheEnable) {
                setConnected(true);
                const _accounts = await web3Prov.eth.getAccounts();
                setAccount(_accounts[0]);
                setLoading(false);
                const currentBlock = await web3Prov.eth.getBlockNumber();
                //subscribe from current block to latest
                /** Events subscriptions change and connect (for init state) **/
                await contract.events.VoteCasted(
                    {fromBlock: currentBlock, toBlock: "latest"},
                    (err: any, events: any) => {
                        // On change event, update votes counts
                        getPositiveVotes();
                        getNegativeVotes();
                    })
                    .on("connected", (subscriptionId: any) => {
                        // on connect (init state)
                        getPositiveVotes();
                        getNegativeVotes();
                    });
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            setError(true);
            handleError(e);
        }
    };

    // Vote method
    const vote = async (voteCode: number) => {
        try {
            setError(false);
            setLoading(true);
            if (contract) {
                await contract.methods
                    .vote(voteCode)
                    .send({from: account, value: web3Prov.utils.toWei("0.01", "ether"), gas: "100000"})
                    // .on("receipt", (receipt: any) => {})
                    .on('error', (error: any, receipt: any, confirmations: any) => {
                        setError(true);
                        handleError(error);
                    });
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            setError(true);
            handleError(e);
        }
    };

    // Handle error message
    const handleError = (_error: any, message?: string) => {
        setError(true);
        if (_error.code) {
            setErrorMsg(_error.message);
        } else {
            setErrorMsg("Transaction has been reverted");
        }
    };

    const clearError = () => {
        setError(false);
    };

    // get votes for YES
    const getPositiveVotes = async () => {
        return contract.methods.votesForYes().call().then((v: any) => {
            setVoteYes(v);
        }).catch((error: any) => {
            handleError(error);
        });
    };

    // get votes for NO
    const getNegativeVotes = async () => {
        return contract.methods.votesForNo().call().then((v: any) => {
            setVoteNo(v);
        }).catch((error: any) => {
            handleError(error);
        });
    };

    useEffect(() => {
        connect().then();
    }, []);


    return (
        <><Container>
            <Col>
                <div className="vertical-break-20"></div>
            </Col>
            <Row className="d-flex flex-row h-100 center-text">
                <Col>
                    <h1>Vote application </h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="vertical-break-100"></div>
                </Col>
            </Row>
            <Row className="d-flex center-text center-element">
                <Col className="center-element">
                    <Button variant="dark" size="lg"  onClick={(e: any) => {
                        vote(2)}} disabled={loading}>Vote for YES</Button>
                </Col>
                <Col className="center-element">
                    <Button variant="dark" size="lg" onClick={(e: any) => {
                        vote(1)}} disabled={loading}>Vote for NO</Button>
                </Col>
            </Row>
            <div className="vertical-break-100"></div>
            <div className="vertical-break-50"></div>
            <VoteStats votesForYes={voteYes} votesForNo={voteNo}/>
            <div className="vertical-break-20"></div>
            {(loading) ? (<h4 className="center-text"> Loading...</h4>) : null}
            {(error) ? (<h4 className="error-text"><b>Error</b> {errorMsg}</h4>) : null}
        </Container></>
    )
};

export default VoteComponent;
