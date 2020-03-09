import React, {FunctionComponent, useEffect} from 'react';
import {Button, Col, Container, Row, Table} from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { useWeb3Context, Web3Consumer } from 'web3-react'
import './VoteComponent.css';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3ConsumerComponent } from "./web3ConsumerComponent";
import {Web3Provider} from "ethers/providers";
import Web3 from "web3";
import {PROPOSAL_ADDRESS, PROPOSAL_LOCAL_ADDRESS} from '../../contracts/Address/contractAddress';
const proposalAbi = require('../../contracts/ABI/Proposal.json');




interface OwnProps {}
type Props = OwnProps;

const VoteComponent: FunctionComponent<Props> = () => {

    const context = useWeb3Context();
    let web3: Web3;
    let _contract: any;
    let account2 = "";
    const [library, setLibrary] = React.useState(undefined);
    const [connected, setConnected] = React.useState(false);
    const [account, setAccount] = React.useState("");
    const [contract, setContract] = React.useState(proposalAbi);
//context.library._web3Provider);

    const connect = async () => {
        try{
            await context.setConnector("Injected");
            web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
            // let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
            const _accounts = await web3.eth.getAccounts();
            console.log(_accounts[0]);
            if(_accounts.length > 0){
                setConnected(true);
                setAccount(_accounts[0]);
                account2 = _accounts[0];
                setAccount(account2);
                _contract = await new web3.eth.Contract(proposalAbi, PROPOSAL_LOCAL_ADDRESS);
                 setContract(_contract)
                // console.log("contrato",_contract);
                // await vote(2);
            }

        }catch (e) {
            // set error
        }
    };


    useEffect(() => {
        connect().then(V=> {
            console.log("contr",contract);
            console.log("cuent", account);

        });
    },[connected]);


    const vote = async (voteCode: number) =>{
        if(_contract){
            _contract.methods.vote(voteCode)
                .send({ from: account2, value: web3.utils.toWei("0.01", "ether"), gas: "1000000" })
                .on("receipt", (receipt: any) => {
                    console.log("parece que logro votar", receipt);
                });
        };

    };

  



    return (
        <><Container>
        <Web3ConsumerComponent></Web3ConsumerComponent>
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
                <Button variant="dark" size="lg" onClick={(e:any)=> {vote(2).then(v=> console.log("voto 2"));}}>Vote for YES</Button>
            </Col>
            <Col className="center-element">
                <Button variant="dark" size="lg">Vote for NO</Button>
            </Col>
        </Row>
        <div className="vertical-break-100"></div>
        <div className="vertical-break-50"></div>

        <Table bordered size="sm">
            <thead className="header-table">
            <tr>
                <th colSpan={2} className="center-text">Stats</th>
            </tr>
            </thead>
            <tbody>
            <tr className="sub-header-table">
                <td className="center-text"><b>Votes for</b></td>
                <td className="center-text"><b>Counts</b></td>
            </tr>
            <tr>
                <td>YES</td>
                <td>3</td>
            </tr>
            <tr>
                <td>NO</td>
                <td>12</td>

            </tr>
            </tbody>
        </Table>
        <button onClick={() => connect()}>sadadsadsa</button>
    </Container></>
    )
};

   export default VoteComponent;
