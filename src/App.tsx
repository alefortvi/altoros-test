import React from 'react';
import VoteComponent from './components/VoteComponent/VoteComponent';
import Web3Provider, { useWeb3Context, Web3Consumer } from "web3-react";
import { ethers } from "ethers";
import connectors from "./connectors";


function App() {
  return (  
    
      <Web3Provider connectors={connectors} libraryName="ethers.js">
      <div className="App">
        <VoteComponent></VoteComponent>
        </div>
      </Web3Provider>
    
  );
}

export default App;