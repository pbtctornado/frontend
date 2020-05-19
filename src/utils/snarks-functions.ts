const randomBytes = require('crypto').randomBytes;
const circomlib = require('circomlib');
const { bigInt } = require('snarkjs');

// Generate random number of specified byte length
const rbigint = (nbytes: number) => bigInt.leBuff2int(randomBytes(nbytes));

// Compute pedersen hash
const pedersenHash = (data: object) => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

// BigNumber to hex string of specified length
const toHex = (number: any, length = 32) =>
    '0x' + (number instanceof Buffer ? number.toString('hex') : bigInt(number).toString(16)).padStart(length * 2, '0');

const getNoteStringAndCommitment = (currency: string, amount: number, netId: number) => {
    const nullifier = rbigint(31);
    const secret = rbigint(31);
    // get snarks note and commitment
    const preimage = Buffer.concat([nullifier.leInt2Buff(31), secret.leInt2Buff(31)]);
    let commitment = pedersenHash(preimage);
    const note: string = toHex(preimage, 62);
    const noteString: string = `tornado-${currency}-${amount}-${netId}-${note}`;
    commitment = toHex(commitment);
    return { noteString, commitment };
};

export { getNoteStringAndCommitment };
