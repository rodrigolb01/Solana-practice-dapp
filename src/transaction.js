//CHallenge 2 send transaction
import * as dotenv from 'dotenv';
dotenv.config();

import * as Web3 from '@solana/web3.js';

var keypair;

const initializeKeypair = async() => {
    const secret = JSON.parse(process.env.PRIVATE_KEY);
    const secretKey = Uint8Array.from(secret);
    const keypairFromSecretKey = Web3.Keypair.fromSecretKey(secretKey);
    keypair = keypairFromSecretKey;
}

await initializeKeypair();

const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));

console.log('airdropping')
await connection.requestAirdrop(keypair.publicKey, Web3.LAMPORTS_PER_SOL*1);

console.log('creating transcation')
const transaction = new Web3.Transaction();
const instruction = Web3.SystemProgram.transfer({
    fromPubkey: keypair.publicKey,
    toPubkey: keypair.publicKey,
    lamports: 1*Web3.LAMPORTS_PER_SOL
});

transaction.add(instruction);

const signature = Web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair]
).then(signature => {console.log('transaction sent with signature: ' + signature)})
