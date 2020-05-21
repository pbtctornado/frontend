// server configuration
import axios from 'axios';
import { NETWORK, SERVER_URL, THE_GRAPH_URL, TORNADO_PBTC_INSTANCES_ADDRESSES } from '../config';

const sendTransactionsToServer = async (userAddress: string, rawApproveTx: string, depositTx: any, btcAmount: number) => {
    // TODO better error handling
    try {
        return await axios
            .post(`${SERVER_URL}/sendtx`, {
                btcAmount: btcAmount,
                userAddress: userAddress, // I want to send ETH to this address
                rawApproveTx: rawApproveTx,
                depositTx: depositTx,
            })
    } catch (error) {
        console.log('Error occured while sending data to the server')
        console.log(error)
        return 'error'
    }
}

const getAnonymitySetSize = async (btcAmount: number) => {
    // convert the address to lowercase, otherwise it won't work
    const tornadoAddress =
        TORNADO_PBTC_INSTANCES_ADDRESSES[NETWORK][btcAmount].toLowerCase();
    const query = `{ anonymitySet(id: "${tornadoAddress}") { size } }`;
    const headers = {
        'Content-Type': 'application/json',
    }
    const data = JSON.stringify({ query: query })

    try {
        const response = await axios.post(THE_GRAPH_URL, data, { headers: headers })
        const anonymitySet = response.data.data.anonymitySet;

        // if there are no deposits in the contract yet, it returns anonymitySet === null
        if (anonymitySet !== null) {
            return anonymitySet.size
        } else {
            return 0
        }
    } catch (error) {
        console.log('Error while requesting anonymity set size')
        console.log(error)
        return 0
    }
}

export { sendTransactionsToServer, getAnonymitySetSize } ;