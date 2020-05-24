import React, { Component } from 'react';
import { generateProof, parseNote } from '../utils/snarks-functions';
import { DEMO_PRIVATE_KEY, NETWORK, TORNADO_PBTC_INSTANCES_ADDRESSES } from '../config';
import { tornadoABI } from '../contracts/tornadoABI';


interface WithdrawPageState {
    noteWithdraw: string;
    btcAddress: string;
}

interface WithdrawPageProps {
    web3: any;
}

class WithdrawPage extends Component<WithdrawPageProps, WithdrawPageState> {
    constructor(props: any) {
        super(props);

        this.state = {
            noteWithdraw: '',
            btcAddress: ''
        };
    }

    handleChange = (event: any) => {
        // Handle change of input fields
        switch (event.target.name) {

            case 'btcRecipientAddress':
                this.setState({ btcAddress: event.target.value });
                break;
            case 'note':
                this.setState({ noteWithdraw: event.target.value });
                break;
            default:
                break;
        }
    };

    /**
     * Do an ETH withdrawal
     */
    withdrawHandler = async () => {
        const refund: string = '0';
        const recipient = this.state.btcAddress;
        const web3 = this.props.web3;
        const { amount, deposit } = parseNote(this.state.noteWithdraw);

        const tornadoAddress =
            TORNADO_PBTC_INSTANCES_ADDRESSES[NETWORK][amount];

        const tornado = new web3.eth.Contract(
            tornadoABI,
            tornadoAddress
        );

        const { proof, args } = await generateProof({ deposit, recipient, refund, tornado })
        args[2] = recipient;

        // private key for demo purposes only
        const senderPrivateKey = DEMO_PRIVATE_KEY;
        const accountSender = web3.eth.accounts.privateKeyToAccount(senderPrivateKey);

        const nonce = await web3.eth.getTransactionCount(accountSender.address);
        const txData = await tornado.methods.withdraw(proof, ...args).encodeABI();

        // sing the transaction with user's private key
        const txSigned = await web3.eth.accounts.signTransaction(
            {
                nonce: nonce,
                to: tornadoAddress,
                value: refund.toString(),
                data: txData,
                gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
                gas: web3.utils.toHex(1e6),
            },
            '0x' + senderPrivateKey
        )

        console.log('Submitting withdraw transaction')
        web3.eth
            .sendSignedTransaction(txSigned.rawTransaction)
            .on('transactionHash', function (hash: string) {
                console.log(['transferToStaging Trx Hash:' + hash]);
            })
            .on('receipt', function (receipt: any) {
                console.log(['transferToStaging Receipt:', receipt]);
            })
            .on('error', console.error);
    }


    render() {
        return <div className='withdraw-wrapper'>
            <label className='withdraw-note-label'>
                <b>Your Note:</b>
                <input
                    name="note"
                    type="text"
                    value={this.state.noteWithdraw}
                    onChange={this.handleChange}
                />
            </label>
            <br />
            <label className='btc-recipient-label'>
                <b>Recipient's Bitcoin Address:</b>
                <input
                    name="btcRecipientAddress"
                    type="text"
                    value={this.state.btcAddress}
                    onChange={this.handleChange}
                />
            </label>
            <button className='hover-button withdraw-button' onClick={this.withdrawHandler}>Withdraw</button>
        </div>;
    }

}

export default WithdrawPage;
