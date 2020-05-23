// const NETWORK = 'mainnet';
const NETWORK = 'ropsten';

// access to Infura ethereum node
const RPC_URL: string = 'https://' + NETWORK + '.infura.io/v3/066eeeca9925471f9db758dc3af48442';

const TORNADO_PBTC_INSTANCES_ADDRESSES: any = {
    // pBTC instance addresses on Ropsten testnet
    ropsten: {
        0.001: '0x8425EBC05AC74338838A0D99Db495906dF2eAe22',
        0.01: '0x2f2d3E612F3341eCDA859f2eB51b3a51b8eB62BB',
        0.1: '0xE9CaA191fc0D5E0C7fEE83b39F008Ba89b75df13',
    },
};

// BTC deposit amount options which show up in th UI (sort the amounts from the lowest to the highest)
const DEPOSIT_AMOUNTS: number[] = Object.keys(TORNADO_PBTC_INSTANCES_ADDRESSES[NETWORK]).sort().map(Number);

const PTOKEN_ADDRESS = {
    ropsten: '0xEB770B1883Dcce11781649E8c4F1ac5F4B40C978',
    mainnet: '0x5228a22e72ccC52d415EcFd199F99D0665E7733b',
};

const PAYMASTER_ADDRESS = '0x55Ef931a040b28657c53c9847de05d81456380Ff';

const SERVER_URL = 'http://192.168.1.14:5000';

// used to get anonymity set size using TheGraph
const THE_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/benesjan/btc-tornado'

export {
    RPC_URL,
    DEPOSIT_AMOUNTS,
    TORNADO_PBTC_INSTANCES_ADDRESSES,
    PTOKEN_ADDRESS,
    PAYMASTER_ADDRESS,
    NETWORK,
    SERVER_URL,
    THE_GRAPH_URL
};
