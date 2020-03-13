import React, {FunctionComponent, useEffect} from 'react';
import {Button, Col, Container, Row} from 'react-bootstrap';
import Web3 from "web3";
import {PROPOSAL_ADDRESS} from '../../../contracts/Address/contractAddress';
import VoteStats from '../VoteStats/VoteStats';
import './VoteElection.css';

const proposalAbi = require('../../../contracts/ABI/Proposal.json');

const VoteElection: FunctionComponent = () => {


    // web3 provider
    const web3Prov = new Web3(Web3.givenProvider);
    // current contract
    const contract = new web3Prov.eth.Contract(proposalAbi, PROPOSAL_ADDRESS);
    // current account
    const [account, setAccount] = React.useState("");
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
    // Already vote
    const [hasAlreadyVoted, setHasAlreadyVoted] = React.useState(false);
    // Disable button despite of loading
    const [disableButton, setDisableButton] = React.useState(false);


    // connection setting
    const connect = async () => {
        setError(false);
        try {
            setLoading(true);
            const isEtheEnable = await (window as any).ethereum.enable();
            if (isEtheEnable) {
                // setConnected(true);
                const accounts = await web3Prov.eth.getAccounts();
                setAccount(accounts[0]);
                setLoading(false);
                const currentBlock = await web3Prov.eth.getBlockNumber();
                /** subscribe from current block to latest
                 Events subscriptions on change and connect (for init state) **/
                await contract.events.VoteCasted(
                    {fromBlock: currentBlock, toBlock: "latest"}, () => {
                        // On change event, update votes counts
                        getPositiveVotes();
                        getNegativeVotes();
                        /** update the state if the account has voted from
                         another site **/
                        getVote(accounts[0]);
                    })
                    .on("connected", () => {
                        // on connect (init state)
                        getPositiveVotes();
                        getNegativeVotes();
                    });
                // detecting account swap1
                await (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
                    setAccount(accounts[0]);
                    getVote(accounts[0]);
                });
                setLoading(false);
                await getVote(accounts[0]);
            }
        } catch (_error) {
            setLoading(false);
            handleError(_error);
        }
    };

    // Vote method
    const vote = async (_voteCode: number) => {
        setError(false);
        setLoading(true);
        try {
            await getVote(account);
            /** second verification: control if the contract exist and the
             *  account has already voted
             This second verification is redundant, prevent the adulteration
             of the page */
            if (contract && (!hasAlreadyVoted)) {
                contract.methods
                    .vote(_voteCode)
                    .send(
                        {
                            from: account,
                            value: web3Prov.utils.toWei("0.01", "ether"),
                            gas: "100000"
                        })
                    .on('error', (_error: any) => {
                        handleError(_error);
                        setLoading(false);
                    })
                    .on('receipt', (_receipt: any) => {
                        setLoading(false);
                        setHasAlreadyVoted(true);
                        setDisableButton(true);
                    });
                // cant vote because the contract doesnt exist or the
                // account has already voted
            } else {
                setLoading(false);
                if (hasAlreadyVoted) {
                    setDisableButton(true);
                } else {
                    handleError(true);
                }
            }
        } catch (_error) {
            setLoading(false);
            handleError(_error);
        }
    };

    // Handle error message
    const handleError = (_error: any, _message?: string) => {
        setError(true);
        if (_error.code) {
            setErrorMsg(_error.message);
        } else {
            setErrorMsg(_message || "Unknown error");
        }
    };


    // get votes for YES
    const getPositiveVotes = async () => {
        return contract.methods.votesForYes().call()
            .then((_votesCounts: any) => {
                setVoteYes(_votesCounts);
            }).catch((_error: any) => {
                handleError(_error);
            });
    };

    // get votes for NO
    const getNegativeVotes = async () => {
        return contract.methods.votesForNo().call()
            .then((_votesCounts: any) => {
                setVoteNo(_votesCounts);
            }).catch((_error: any) => {
                handleError(_error);
            });
    };

    const getVote = async (_account: any) => {
        return await contract.methods.getVote(_account).call()
            .then((_hasVoted: any) => {
                setHasAlreadyVoted(_hasVoted > 0);
                if (_hasVoted > 0) {
                    setDisableButton(true);
                } else {
                    setDisableButton(false);
                }
            });
    }


    useEffect(() => {
        connect();
    }, []);


    return (
        <><Container>
            <Col>
                <div className="vertical-break-20"/>
            </Col>
            <Row className="d-flex flex-row h-100 center-text">
                <Col>
                    <h1>Vote application </h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="vertical-break-100"/>
                </Col>
            </Row>
            <Row className="d-flex center-text center-element">
                <Col className="center-element">
                    <Button variant="dark" size="lg" onClick={(evt: any) => {
                        vote(2)
                    }} disabled={loading || disableButton}>Vote for YES</Button>
                </Col>
                <Col className="center-element">
                    <Button variant="dark" size="lg" onClick={(evt: any) => {
                        vote(1)
                    }} disabled={loading || disableButton}>Vote for NO</Button>
                </Col>
            </Row>
            <div className="vertical-break-100"/>
            <div className="vertical-break-50"/>
            <VoteStats votesForYes={voteYes} votesForNo={voteNo}/>
            <div className="vertical-break-20"/>
            {(loading) ? (<h4 className="center-text"> Loading...</h4>) : null}
            {(error) ? (<h4 className="error-text"><b>Error</b> {errorMsg}</h4>) : null}
            {(hasAlreadyVoted) ? (<h4 className="already-voted-text"><b> This account has already voted </b></h4>) : null}
        </Container></>
    )
};

export default VoteElection;
