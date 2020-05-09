import React, { Component } from "react";
import { DEPOSIT_AMOUNTS } from "./config";
import "./styles/App.css";

// initial state interface
interface IState {
  pbtcAmount: number; // the amount of BTC which the user wants to send to Tornado (options: [100, 10, 1, 0.1, 0.01, 0.001])
}

// pass props - {} and state - IState to Component class
class App extends Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      pbtcAmount: 0.1, // default option
    };
  }

  // set the amount of pbtc which the user wants to deposit
  setPbtcAmount = (amount: number) => {
    this.setState({ pbtcAmount: amount });
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
        {amountOptions}
        {this.state.pbtcAmount}
      </div>
    );
  }
}

export default App;
