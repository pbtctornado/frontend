import React, { Component } from "react";
import { DEPOSIT_AMOUNTS, RPC_URL } from "./config";
import "./styles/App.css";
import { pBTC } from "ptokens-pbtc";
import { rbigint, toHex, createDeposit } from "./utils/snarks-functions";
const ethers = require("ethers");
const Web3 = require("web3");

// initial state interface
interface IState {
  pbtcAmount: number; // the amount of BTC which the user wants to send to Tornado (options: [100, 10, 1, 0.1, 0.01, 0.001])
  ethProvider: any;
  pbtc: any;
  btcDepositAddress: string;
  pbtcRecipientAddress: string;
  mnemonic: string;
}

// pass props - {} and state - IState to Component class
class App extends Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      pbtcAmount: 0.1, // default option
      ethProvider: null,
      pbtc: null,
      btcDepositAddress: "",
      pbtcRecipientAddress: "",
      mnemonic: "",
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
  showInfoHandler = async () => {
    const wallet = await this.getWallet();
    const { privateKey, address, mnemonic } = wallet.signingKey;
    const btcDepositAddress: string = await this.getBtcAddress(address);
    const depositTx = await this.getDepositTransation(privateKey);
    const approveTx = await this.getApproveTransaction(privateKey);

    // TODO send depositTx and approveTx to OpenGSN

    this.setState({
      btcDepositAddress,
      mnemonic,
      pbtcRecipientAddress: address,
    });
  };

  getDepositTransation = async (privateKey: string) => {};
  getApproveTransaction = async (privateKey: string) => {};
  getNoteAndCommitment = async () => {
    // get snarks ommitment and private key
    const deposit = createDeposit(rbigint(31), rbigint(31));
    const amount: number = this.state.pbtcAmount * 10 ** 3;
    const chainId: number = this.state.ethProvider.network.chainId;

    const commitment = toHex(deposit.commitment);
    const note = `tornado-eth-${amount}-${chainId}-${toHex(
      deposit.preimage,
      62
    )}`;

    return { commitment, note };
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

  getWallet = async () => {
    // generate 12 words mnemonic
    const mnemonic12 = await ethers.utils.HDNode.entropyToMnemonic(
      ethers.utils.randomBytes(16)
    );

    return ethers.Wallet.fromMnemonic(mnemonic12);
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

    let depositInfo = <></>;
    if (this.state.btcDepositAddress !== "") {
      depositInfo = (
        <div className="deposit-info-div">
          Send Bitcoin to this address: <br />
          {this.state.btcDepositAddress}
          <br /> <br />
          pBTC will be sent to this Address: <br />
          {this.state.pbtcRecipientAddress} <br /> <br />
          Mnemonic phrase to access the address: <br />
          {this.state.mnemonic} <br /> <br />
        </div>
      );
    }
    return (
      <div className="App">
        <h1>Tornado Bitcoin</h1>
        Select the amount of BTC do deposit:
        {amountOptions}
        <button onClick={this.showInfoHandler}>Show BTC deposit address</button>
        {depositInfo}
      </div>
    );
  }
}

export default App;
