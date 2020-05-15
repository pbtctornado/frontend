import crypto from 'crypto';
const circomlib = require('circomlib');
const { bigInt } = require('snarkjs');

// Deposit interface (use 'any' because I want to assign properties dynamically)
interface Deposit {
    commitment?: bigint;
    nullifier?: any;
    secret?: any;
    preimage?: any;
    nullifierHash?: bigint;
}

// Generate random number of specified byte length
const rbigint = (nbytes: number) => bigInt.leBuff2int(crypto.randomBytes(nbytes));

// Compute pedersen hash
const pedersenHash = (data: object) => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

// BigNumber to hex string of specified length
const toHex = (number: any, length = 32) =>
    '0x' + (number instanceof Buffer ? number.toString('hex') : bigInt(number).toString(16)).padStart(length * 2, '0');

// Create deposit object from secret and nullifier
const createDeposit = (nullifier: bigint, secret: bigint) => {
    let deposit: Deposit = { nullifier, secret };
    deposit.preimage = Buffer.concat([deposit.nullifier.leInt2Buff(31), deposit.secret.leInt2Buff(31)]);
    deposit.commitment = pedersenHash(deposit.preimage);
    deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31));
    return deposit;
};

const getNoteStringAndCommitment = (btcAmount: number, chainId: number) => {
    // get snarks note and commitment
    const deposit = createDeposit(rbigint(31), rbigint(31));
    const amount: number = btcAmount * 10 ** 3;
    const note: string = toHex(deposit.preimage, 62);
    const noteString: string = `tornado-eth-${amount}-${chainId}-${note}`;
    const commitment: string = toHex(deposit.commitment);
    return { noteString, commitment };
};

export { getNoteStringAndCommitment };
