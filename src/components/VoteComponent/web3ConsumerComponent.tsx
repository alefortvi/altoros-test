import { Web3Consumer } from "web3-react";

import React from "react";

export function Web3ConsumerComponent() {
  return (
    <Web3Consumer>
      {(context: { active: any; connectorName: any; account: any; networkId: any; }) => {
        const { active, connectorName, account, networkId } = context;
        return (
          active && (
            <div></div>
          )
        );
      }}
    </Web3Consumer>
  );
}