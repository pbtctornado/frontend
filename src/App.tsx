import React, { Component } from 'react';
import { pBTC } from 'ptokens-pbtc';
import { createDeposit, rbigint, toHex } from './utils/snarks-functions';
import { DEPOSIT_AMOUNTS, RPC_URL } from './config';
import './styles/App.css';

const ethers = require('ethers');
const Web3 = require('web3');

// State interface
interface State {
    btcAmount: number; // the amount of BTC which the user wants to send to Tornado
    btcDepositAddress: string;
    note: string; // note which allows the user to withdraw pBTC from Tornado
    ethProvider: any;
    pbtc: any; // pbtc instance which allows us to generate BTC deposit address
    wallet: any; // stores information about mnemonic, address, private key
    loading: boolean;
}

// pass props and State interface to Component class
class App extends Component<{}, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            btcAmount: 0.1, // default option
            btcDepositAddress: '',
            note: '',
            ethProvider: null,
            pbtc: null,
            wallet: null,
            loading: false,
        };
    }

    componentDidMount = async () => {
        // I have to use Web3 provider, because pbtc instance accepts only Web3 provider, not default ethers providers
        const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

        // convert web3 provider to ethers provider
        const ethProvider = new ethers.providers.Web3Provider(web3.currentProvider);
        this.setState({ ethProvider });

        // TODO is it somehow possible to convert ethers.getDefaultProvider() to pbtc instance without the need to use web3 provider?
    };

    // set the amount of pbtc which the user wants to deposit
    setBtcAmountHandler = (amount: number) => {
        this.setState({ btcAmount: amount });
    };

    // this function is executed when the user confirms his deposit amount of BTC
    showDepositInfoHandler = async () => {
        this.setState({ loading: true });

        // generate user's ethereum wallet, note and commitment
        const wallet = ethers.Wallet.createRandom();
        const { note, commitment } = this.getNoteAndCommitment();

        // generate BTC deposit address and signed transactions
        const btcDepositAddress: string = await this.getBtcAddress(wallet.address);
        const approveTx = await this.getApproveTransaction(wallet.privateKey);
        const depositTx = await this.getDepositTransation(wallet.privateKey, commitment);

        // TODO send signed transactions to our server. Call setState() only after the server confirms that it received the information
        // TODO send approveTx and depositTx to OpenGSN from our server
        // TODO create EventListner on the server which waits until wallet.address receives pBTC

        // set the new state after all of the code above processed without an error
        this.setState({
            btcDepositAddress,
            wallet,
            note,
            loading: false,
        });
    };

    getDepositTransation = async (privateKey: string, commitment: string) => {
        // Creates a transaction which sends pBTC from user's address to tornado contract
        // Tornado contract is selected based on the amount of BTC which the user wants to deposit (this.state.btcAmount)
        // TODO create and return deposit transaction signed by privateKey
        return null;
    };

    getApproveTransaction = async (privateKey: string) => {
        // Creates a transaction which allows tornado contract spend user's pBTC
        // Tornado contract is selected based on the amount of BTC which the user wants to deposit (this.state.btcAmount)
        // TODO create and return approve transaction signed by privateKey
        return null;
    };

    getNoteAndCommitment = () => {
        // get snarks note and commitment
        const deposit = createDeposit(rbigint(31), rbigint(31));
        const amount: number = this.state.btcAmount * 10 ** 3;
        const chainId: number = this.state.ethProvider.network.chainId;
        const note: string = `tornado-eth-${amount}-${chainId}-${toHex(deposit.preimage, 62)}`;
        const commitment: string = toHex(deposit.commitment);
        return { note, commitment };
    };

    getBtcAddress = async (ethAddress: string) => {
        // get BTC deposit address based on the amount of BTC which user selected
        // create pbtc instance and pass it web3 provider
        const pbtc = new pBTC({
            ethProvider: this.state.ethProvider._web3Provider,
            btcNetwork: 'testnet', //'testnet' or 'bitcoin', default 'testnet'
        });
        // get btc deposit address and return it as string
        const btcDepositAddress = await pbtc.getDepositAddress(ethAddress);
        return btcDepositAddress.toString();
    };

    render() {
        const amountOptions = (
            <ul className="deposit-amounts-ul">
                {DEPOSIT_AMOUNTS.map((amount, index) => (
                    <li key={index}>
                        <input
                            checked={this.state.btcAmount === amount}
                            type="radio"
                            name="btcAmounts"
                            id={index.toString()}
                            value={amount}
                            onChange={() => this.setBtcAmountHandler(amount)}
                            disabled={this.state.loading} // don't allow the user to change pBTC amount while the BTC address is being generated
                        />
                        <label htmlFor={index.toString()}>{amount} BTC</label>
                    </li>
                ))}
            </ul>
        );

        // show deposit information is available
        let depositInfo = <></>;
        if (
            this.state.btcDepositAddress !== '' &&
            this.state.wallet !== null &&
            this.state.note !== '' &&
            !this.state.loading
        ) {
            let { address, mnemonic } = this.state.wallet;

            depositInfo = (
                <div>
                    Send Bitcoin to this address: <br />
                    {this.state.btcDepositAddress}
                    <br /> <br />
                    Your note: <br />
                    {this.state.note} <br /> <br />
                    pBTC will be sent to this Address: <br />
                    {address} <br /> <br />
                    Mnemonic phrase to access your wallet: <br />
                    {mnemonic} <br /> <br />
                </div>
            );
        }
        return (
            <div className="App">
                <h1>Tornado Bitcoin</h1>
                Select the amount of BTC to deposit:
                {amountOptions}
                <button onClick={this.showDepositInfoHandler}>Show BTC deposit address</button>
                {depositInfo}
                {this.state.loading ? <div>Loading...</div> : <></>}
            </div>
        );
    }
}

export default App;
