// const NETWORK = 'mainnet';
const NETWORK = 'ropsten';

// access to Infura ethereum node
const RPC_URL: string = 'https://' + NETWORK + '.infura.io/v3/066eeeca9925471f9db758dc3af48442';

const TORNADO_PBTC_INSTANCES_ADDRESSES = {
    // pBTC instance addresses on Ropsten testnet
    ropsten: {
        0.001: '0x8627d3F01Ccf0c3a7e6B8b7b94131883D0BB58FA',
        0.01: '0xb0693011Ba657438B772436605e2282e34950791',
        0.1: '0xcEA2004398c42096093cB6F374E21a3E04e2143c',
        1: '0x76cA985007B00CF9454c1C097B26895D1f06AB7f',
        10: '0x242C27B896b53ae011f847dbCD99F525d2801f89',
        100: '0x7eBF6A1e387218bca031f49eB26b4d443F2b96E3',
    },
};

// BTC deposit amount options which show up in th UI
const DEPOSIT_AMOUNTS: number[] = Object.keys(TORNADO_PBTC_INSTANCES_ADDRESSES[NETWORK]).map(Number);

const PTOKEN_ADDRESS = {
    ropsten: '0xEB770B1883Dcce11781649E8c4F1ac5F4B40C978',
    mainnet: '0x5228a22e72ccC52d415EcFd199F99D0665E7733b',
};

export { RPC_URL, DEPOSIT_AMOUNTS, TORNADO_PBTC_INSTANCES_ADDRESSES, PTOKEN_ADDRESS };
