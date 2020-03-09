import { Connectors } from "web3-react";

const {
  InjectedConnector,
  NetworkOnlyConnector,
} = Connectors;

const supportedNetworkURLs = {
  /*1: "https://mainnet.infura.io/v3/60ab76e16df54c808e50a79975b4779f",*/
  1: "http://127.0.0.1:8545"
};

const defaultNetwork = 1;

const Injected = new InjectedConnector({
  supportedNetworks: [1]
});

const Network = new NetworkOnlyConnector({
  providerURL: supportedNetworkURLs[1]
});



export default {
  Injected,
  Network,
};
