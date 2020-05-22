import React, { Component } from 'react';

interface WithdrawPageState {
    noteWithdraw: string;
    btcAddress: string;
}

class WithdrawPage extends Component<{}, WithdrawPageState> {
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

            case 'btcReceiverAddress':
                this.setState({ btcAddress: event.target.value });
                break;
            case 'note':
                this.setState({ noteWithdraw: event.target.value });
                break;
            default:
                break;
        }
    };

    render() {
        return <div className='withdraw-wrapper'>
            <label className='withdraw-note-label'>
                Your Note:
                <input
                    name="note"
                    type="text"
                    value={this.state.noteWithdraw}
                    onChange={this.handleChange}
                />
            </label>
            <label className='btc-recipient-label'>
                Recipient Bitcoin Address:
                <input
                    name="btcReceiverAddress"
                    type="text"
                    value={this.state.btcAddress}
                    onChange={this.handleChange}
                />
            </label>
        </div>;
    };

};

export default WithdrawPage;
