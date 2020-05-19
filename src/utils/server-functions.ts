// server configuration
import axios from 'axios';

// set the server base URL
const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.14:5000/',
});

const sendTransactionsToServer = async (address: string, approveRawTx: string, depositTx: any, amount: number) => {
    // TODO better error handling
    try {
        return await axiosInstance
            .post('/sendtx', {
                btcAmount: amount,
                userAddress: address, // I want to send ETH to this address
                rawApproveTx: approveRawTx,
                depositTx: depositTx,
            })
    } catch (error) {
        console.log('Error occured while sending data to the server')
        console.log(error)
        return 'error'
    }
}

export { sendTransactionsToServer } ;