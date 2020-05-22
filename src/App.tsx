import React, { Component } from 'react';
import { RPC_URL, } from './config'
import WithdrawPage from './components/WithdrawPage';
import DepositPage from './components/DepositPage';

import './styles/App.css';

const Web3 = require('web3');

// State interface
interface State {
    btcReceiverAddress: string;
    noteWithdraw: string;
    pageSelected: string;
    web3: any;
}

// pass props and State interface to Component class
class App extends Component<{}, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            btcReceiverAddress: '',
            noteWithdraw: '',
            pageSelected: 'deposit',
            web3: null,
        };
    }

    componentDidMount = async () => {
        // I have to use Web3 provider, because pbtc instance accepts only Web3 provider, not default ethers providers
        const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
        this.setState({ web3 });
    };



    switchToDeposit = () => {
        this.setState({ pageSelected: 'deposit' })
    }

    switchToWithdraw = () => {
        this.setState({ pageSelected: 'withdraw' })
    }

    render() {

        let pageContent = (<DepositPage
            web3={this.state.web3}
        />);

        if (this.state.pageSelected === 'withdraw') {
            pageContent = <WithdrawPage/>;
        }
        return (
            <div className="App">
                <h1>BTC Tornado</h1>
                <div className='page-selector-div'>
                    <button onClick={this.switchToDeposit}>Deposit</button>
                    <button onClick={this.switchToWithdraw}>Withdraw</button>
                </div>
                {pageContent}
            </div>
        );
    }
}

export default App;
