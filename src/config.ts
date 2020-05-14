// const NETWORK = 'mainnet';
const NETWORK = 'ropsten';

// access to Infura ethereum node
const RPC_URL: string = 'https://' + NETWORK + '.infura.io/v3/066eeeca9925471f9db758dc3af48442';

const TORNADO_PBTC_INSTANCES_ADDRESSES = {
    // pBTC instance addresses on Ropsten testnet
    ropsten: {
        0.001: '0xb5c512E013c1f17a5ed157c557c6891558f1a719',
        0.01: '0x0bD3D556707bEFe41C6215Dc8bf06D81616D6112',
        0.1: '0x731a0e7c35dC9b7002be432770F78aF99f2FAf02',
        1: undefined,
        10: undefined,
        100: undefined,
    },
};

// BTC deposit amount options which show up in th UI
const DEPOSIT_AMOUNTS: number[] = Object.keys(TORNADO_PBTC_INSTANCES_ADDRESSES[NETWORK]).map(Number);

const PTOKEN_ADDRESS = {
    ropsten: '0xEB770B1883Dcce11781649E8c4F1ac5F4B40C978',
    mainnet: '0x5228a22e72ccC52d415EcFd199F99D0665E7733b',
};

export { RPC_URL, DEPOSIT_AMOUNTS, TORNADO_PBTC_INSTANCES_ADDRESSES, PTOKEN_ADDRESS };
