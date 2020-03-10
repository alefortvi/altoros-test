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
    const [error, setError] = React.useState(false);
    const [library, setLibrary] = React.useState(undefined);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [connected, setConnected] = React.useState(false);
    const [account, setAccount] = React.useState("");
    // const [web3Prov, setWeb3Prov] = React.useState(new Web3(Web3.givenProvider || 'http://localhost:8545'));
    const [web3Prov, setWeb3Prov] = React.useState(new Web3(Web3.givenProvider));

    const [contract, setContract] = React.useState(proposalAbi);
//context.library._web3Provider);

    const connect = async () => {
        try{
            // await context.setConnector("Injected");
            let _web3 = new Web3(Web3.givenProvider);
            //setWeb3Prov(_web3);
            console.log("web3",web3Prov);
            // let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
            const _accounts = await web3Prov.eth.getAccounts();
            console.log(_accounts[0]);
            if(_accounts.length > 0){
                setConnected(true);
                setAccount(_accounts[0]);
                console.log(account);
                _contract = await new web3Prov.eth.Contract(proposalAbi, PROPOSAL_ADDRESS);
                 setContract(_contract)
                 console.log("contrato",contract);
                 console.log("web3",web3Prov);
                // await vote(2);

                // suscripcion a evento

                console.log("evento", contract.events);


                console.log("evento 2", contract.VoteCasted());


                // ////**********************************************************/
                //

                // ////**********************************************************/
                //
                // web3Prov.eth.subscribe('pendingTransactions', (error, result) =>{
                //     if (!error)
                //         console.log("resultado ok", result);
                // })
                //     .on("data", function(transaction){
                //         console.log(transaction);
                //     })
                //     .on("error", function(error){
                //         console.log("salio por error", error);
                //     });
            }

        }catch (e) {
            // set error
        }
        return 1;
    };


    useEffect(() => {
        connect().then(V=> {
            console.log("!!!!!!!!",contract);
        });
    },[connected]);


    const vote = async (voteCode: number) =>{
        setError(false)
        if(contract){
                await contract.methods
                    .vote(voteCode)
                    .send({ from: account, value: web3Prov.utils.toWei("0.01", "ether"), gas: "100000" })
                    .on("receipt", (receipt: any) => {
                        console.log("parece que logro votar", receipt);
                    })
                    .on('error', (error: any, receipt: any, confirmations: any) => {
                        setError(true);
                        if(error.code){
                            setErrorMsg(error.message);
                        }
                        else{
                            setErrorMsg("Transaction has been reverted by the EVM");
                        }
                    })
        };
    };


    const getVotes = async () =>{
        setError(false)
        if(contract){
            contract.methods.getVote(account).call().then((v: any)=>{
                console.log("GET VOTES",v);
            });
        };
    };


    const getVotosYes = async () =>{
        setError(false)
        if(contract){
            contract.methods.votesForYes().call().then((v: any)=>{
                console.log("GET VOTES YES",v);
            });

        };
    };




    return (
        <><Container>
        {/*<Web3ConsumerComponent></Web3ConsumerComponent>*/}
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
                <Button variant="dark" size="lg" onClick={(e:any)=> {vote(2).then(v=> console.log("voto 2"))}}>Vote for YES</Button>
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
            {(error)?(<h1>Error {errorMsg}</h1>):null}

            <button onClick={
                (e: any) => {getVotes()}}>aaaaaa</button>
            <button onClick={
                (e: any) => {getVotosYes()}}>votos yes</button>
    </Container></>
    )
};

   export default VoteComponent;
