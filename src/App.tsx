import React, { Component } from "react";
import { DEPOSIT_AMOUNTS, RPC_URL } from "./config";
import "./styles/App.css";
import { pBTC } from "ptokens-pbtc";
const ethers = require("ethers");
const Web3 = require("web3");

// initial state interface
interface IState {
  pbtcAmount: number; // the amount of BTC which the user wants to send to Tornado (options: [100, 10, 1, 0.1, 0.01, 0.001])
  ethProvider: any;
  pbtc: any;
}

// pass props - {} and state - IState to Component class
class App extends Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      pbtcAmount: 0.1, // default option
      ethProvider: null,
      pbtc: null,
    };
  }

  componentDidMount = async () => {
    // I need to use web3 to get the provider, because pbtc instance accepts only Web3 provider as a Web3 object
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

    // convert web3 provider to ethers provider
    const ethProvider = new ethers.providers.Web3Provider(web3.currentProvider);

    this.setState({ ethProvider });
  };

  // set the amount of pbtc which the user wants to deposit
  setPbtcAmount = (amount: number) => {
    this.setState({ pbtcAmount: amount });
  };

  // this function is executed when the users confirms his deposit amount of BTC
  showDepositInformation = async () => {
    const btcDepositAddress: string = await this.getBtcAddress(
      "0x831C10b32D14Ae3D20e7316153Abeb51cBd27e87"
    );
    console.log(btcDepositAddress);
  };

  // get BTC deposut address based on the amount of BTC which user selected
  getBtcAddress = async (ethAddress: string) => {
    console.log("Generating BTC deposit address...");

    // create pbtc instance
    const pbtc = new pBTC({
      ethProvider: this.state.ethProvider._web3Provider,
      btcNetwork: "testnet", //'testnet' or 'bitcoin', default 'testnet'
    });

    const btcDepositAddress = await pbtc.getDepositAddress(ethAddress);
    return btcDepositAddress.toString();
  };

  render() {
    const amountOptions = (
      <ul className="deposit-amounts-ul">
        {DEPOSIT_AMOUNTS.map((amount, index) => (
          <li key={index}>
            <input
              checked={this.state.pbtcAmount === amount}
              type="radio"
              name="btcAmounts"
              id={index.toString()}
              value={amount}
              onChange={() => this.setPbtcAmount(amount)}
            />
            <label htmlFor={index.toString()}>{amount} BTC</label>
          </li>
        ))}
      </ul>
    );

    return (
      <div className="App">
        <h1>Tornado Bitcoin</h1>
        Select the amount of BTC do deposit:
        {amountOptions}
        {this.state.pbtcAmount}
        <button onClick={this.showDepositInformation}>
          Show BTC deposit address
        </button>
      </div>
    );
  }
}

export default App;
