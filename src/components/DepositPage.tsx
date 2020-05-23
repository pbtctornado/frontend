import React, { Component } from 'react';
import {
    DEPOSIT_AMOUNTS,
    NETWORK,
    PAYMASTER_ADDRESS,
    PTOKEN_ADDRESS,
    TORNADO_PBTC_INSTANCES_ADDRESSES
} from '../config';
import { pTokenABI } from '../contracts/pTokenABI';
import { paymasterABI } from '../contracts/paymasterABI'
import { pBTC } from 'ptokens-pbtc';
import { getNoteStringAndCommitment } from '../utils/snarks-functions';
import { getAnonymitySetSize, sendTransactionsToServer } from '../utils/axios-functions';
import Spinner from './Spinner';

const ethers = require('ethers');

interface DepositPageState {
    btcAmount: number; // the amount of BTC which the user wants to send to Tornado
    paymasterFee: number;
    anonymitySetSize: number;
    depositAmountWithFees: number;
    btcDepositAddress: string;
    noteString: string; // a string which allows the user to withdraw pBTC from Tornado
    pbtc: any; // pbtc instance which allows us to generate BTC deposit address
    wallet: any; // stores information about mnemonic, address, private key
    loading: boolean;
    anonymitySetLoading: boolean;
    showDepositInfo: boolean;
}

interface DepositPageProps {
    web3: any;
}

// pass props and State interface to Component class
class DepositPage extends Component<DepositPageProps, DepositPageState> {

    constructor(props: any) {
        super(props);

        this.state = {
            btcAmount: 0.001, // default option
            paymasterFee: 0,
            anonymitySetSize: 0,
            depositAmountWithFees: 0,
            btcDepositAddress: '',
            noteString: '',
            pbtc: null,
            wallet: null,
            loading: false,
            anonymitySetLoading: false,
            showDepositInfo: false,
        };
    }

    componentDidMount = async () => {
        // load anonymity et size
        this.setAnonymitySetSize(this.state.btcAmount)
    };

    // set the amount of BTC which the user wants to deposit
    setBtcAmountHandler = (amount: number) => {
        this.setState({ btcAmount: amount, showDepositInfo: false });

        // show anonymity set size for selected amount
        this.setAnonymitySetSize(amount)
    };

    getDepositTransation = async (privateKey: string, address: string, commitment: string) => {
        // TODO create and return deposit meta-transaction signed by privateKey
        const tornadoAddress =
            TORNADO_PBTC_INSTANCES_ADDRESSES[NETWORK][this.state.btcAmount];

        return null
    };

    getApproveTransaction = async (privateKey: string, addressFrom: string) => {
        // get pToken contract instance
        const pTokenAddress = PTOKEN_ADDRESS[NETWORK];
        const pTokenContract = new this.props.web3.eth.Contract(pTokenABI, pTokenAddress);

        // get spender (=tornado) address and approval amount
        // TODO approve more than this.state.btcAmount - add pToken Fees and OpenGSN fees
        const amountToApprove = this.state.btcAmount * 10 ** 18;
        const tornadoAddress =
            TORNADO_PBTC_INSTANCES_ADDRESSES[NETWORK][this.state.btcAmount];

        // get transaction data for approve() method called on pToken contract
        const txData = pTokenContract.methods
            .approve(tornadoAddress, amountToApprove.toString())
            .encodeABI();

        // return transaction signed with user's private key
        // TODO get better gas estimate
        return await this.props.web3.eth.accounts.signTransaction(
            {
                nonce: 0, // set nonce to 0 because this will be the first transaction of just generated account
                from: addressFrom,
                to: pTokenAddress,
                value: 0,
                data: txData,
                gasPrice: this.props.web3.utils.toHex(this.props.web3.eth.getGasPrice()),
                gas: this.props.web3.utils.toHex(3000000),
            },
            privateKey
        )
    };

    getBtcAddress = async (ethAddress: string) => {
        // get BTC deposit address based on the amount of BTC which user selected
        // create pbtc instance and pass it web3 provider
        const pbtc = new pBTC({
            ethProvider: this.props.web3.currentProvider,
            btcNetwork: 'testnet', //'testnet' or 'bitcoin', default 'testnet'
        });
        // get btc deposit address and return it as string
        const btcDepositAddress = await pbtc.getDepositAddress(ethAddress);
        return btcDepositAddress.toString();
    };

    /**
     * Returns pBTC fee which is charged by paymaster contract
     */
    getPaymasterFee = async () => {
        const paymasterContract = new this.props.web3.eth.Contract(paymasterABI, PAYMASTER_ADDRESS);
        // get fee from paymaster contract
        let fee = await paymasterContract.methods.fee().call()
        // convert it to the same format as BTC displayed in the UI
        fee = parseFloat(fee) / 10 ** 18
        return fee
    }

    // this function is executed when the user confirms his deposit amount of BTC
    showDepositInfoHandler = async () => {
        // TODO better error handling
        try {
            this.setState({ loading: true });

            // generate user's ethereum wallet, noteString and commitment
            const wallet = ethers.Wallet.createRandom();
            const { noteString, commitment } = getNoteStringAndCommitment(
                'pbtc',
                this.state.btcAmount,
                await this.props.web3.eth.net.getId()
            );

            // generate BTC deposit address and signed transactions
            const approveTx = await this.getApproveTransaction(wallet.privateKey, wallet.address);
            const depositTx = await this.getDepositTransation(wallet.privateKey, wallet.address, commitment);
            const btcDepositAddress: string = await this.getBtcAddress(wallet.address);
            const paymasterFee = await this.getPaymasterFee();

            // send transaction data to the server
            const response = await sendTransactionsToServer(
                wallet.address,
                approveTx.rawTransaction,
                'depositTx',
                this.state.btcAmount * 10 ** 18);

            // if the data was sent without an error, show deposit info to the user
            if (response !== 'error') {
                this.setState({
                    paymasterFee,
                    btcDepositAddress,
                    wallet,
                    noteString,
                    loading: false,
                    showDepositInfo: true,
                }, () => {
                    console.log('Success!')
                });
            } else {
                this.setState({ loading: false });
            }
        } catch (error) {
            console.log('Error occured when generating deposit information.');
            console.error(error);
            this.setState({ loading: false });
        }
    };

    setAnonymitySetSize = async (amount: number) => {
        this.setState({ anonymitySetLoading: true });
        let size = await getAnonymitySetSize(amount)
        this.setState({ anonymitySetSize: size, anonymitySetLoading: false });
    }

    render() {

        const amountOptions = (
            <ul className="deposit-amounts-ul">
                {DEPOSIT_AMOUNTS.map((amount, index) => (
                    <li key={index}>
                        <label className="container">{amount} BTC
                            <input
                                checked={this.state.btcAmount === amount}
                                type="radio"
                                name="btcAmounts"
                                id={index.toString()}
                                value={amount}
                                onChange={() => this.setBtcAmountHandler(amount)}
                                disabled={this.state.loading} // don't allow the user to change pBTC amount while the BTC address is being generated
                            />
                            <span className="checkmark"></span>
                        </label>
                    </li>
                ))}
            </ul>
        );

        // show deposit information is available
        let depositInfo = <></>;
        if (
            this.state.btcDepositAddress !== '' &&
            this.state.wallet !== null &&
            this.state.noteString !== '' &&
            !this.state.loading &&
            this.state.showDepositInfo
        ) {
            let { address, mnemonic } = this.state.wallet;
            let { paymasterFee, btcAmount } = this.state;

            depositInfo = (
                <div className='deposit-info-div'>
                    <h3>DEPOSIT INFORMATION:</h3>
                    <div>
                        <b>Send <span style={{color: '#f35c21'}}>{(btcAmount + paymasterFee).toFixed(4).toString()} BTC</span> to this address:</b>
                        <div className='remember-info'>{this.state.btcDepositAddress}</div>
                        <b>Your note to withdraw anonymized BTC:</b>
                        <div className='remember-info'>{this.state.noteString}</div>
                    </div>
                    <span className='fee-name'>* we charge {paymasterFee} BTC fee to pay for all the necessary transactions</span>
                    {/*<h4>In case the transaction to tornado fails, this is the wallet where you receive non-anonymised BTC</h4>*/}
                    {/*<b>Wallet address:</b> <br />*/}
                    {/*{address} <br /> <br />*/}
                    {/*<b>Mnemonic phrase to access your wallet:</b>  <br />*/}
                    {/*{mnemonic} <br /> <br />*/}
                </div>
            );
        }

        let depositButton = (
            <button className='generate-deposit-info-button hover-button' onClick={this.showDepositInfoHandler}>
                Generate deposit information
            </button>);

        if (this.state.showDepositInfo) {
            depositButton = <></>
        }

        return (<div>
            <h3 className='deposit-headline'>Choose the amount of BTC to anonymize</h3>
            <h3 className='anonymity-size-h'>Anonymity set size: {this.state.anonymitySetSize}</h3>

            {amountOptions}

            {depositInfo}

            {this.state.loading ? <Spinner /> : <>{depositButton}</>}
        </div>);
    }
}


export default DepositPage;