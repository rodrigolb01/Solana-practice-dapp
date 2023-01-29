import * as dotenv from 'dotenv'
dotenv.config();

import * as Web3 from "@solana/web3.js";

const PROGRAM_ADDRESS = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa';
const PROGRAM_DATA_ADDRESS = 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod';

var balance;

const setBalance = (val) => {
    balance = val;
}

const printBalance = async(address) => {
    
    await getBalanceUsingWeb3(address);
    console.log(`balance of account ${address} : ${balance}`);
}

//Creates a new keypair and shows private key 
async function generateKeyPair()
{
    const newKeyPair = await Web3.Keypair.generate();
    console.log(newKeyPair.secretKey.toString());
}

//Derive public key from a generated private key
function initializeKeypair()
{
    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "");
    const secretKey = Uint8Array.from(secret);
    const keypairFromSecretKey = Web3.Keypair.fromSecretKey(secretKey);
    return keypairFromSecretKey;
}

async function getBalanceUsingWeb3(address)
{
    try {
        const key = new Web3.PublicKey(address);
        const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));
        return connection.getBalance(key).then(balance => {
            setBalance(balance/Web3.LAMPORTS_PER_SOL);
        });
    } catch (error) {
        setBalance(0);
        console.log('address invalid!');
    }
}

async function isAccountExecutable(address)
{
    try {
        const key = new Web3.PublicKey(address);
        const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));
        connection.getAccountInfo(key).then(res => {
            console.log(`account ${address} is executable: ${res.executable}`);
        });
    } catch (error) {
        console.log('failed to get account info');
    }
}

async function sendTransaction(fromPubKey, toPubKey, amount)
{
    try {
        const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));

        const sendSolInstruction = Web3.SystemProgram.transfer({
            fromPubkey: fromPubKey,
            toPubkey: toPubKey,
            lamports: Web3.LAMPORTS_PER_SOL * amount
        })

        const transaction = new Web3.Transaction();
        transaction.add(sendSolInstruction);

        const signature = Web3.sendAndConfirmTransaction(
            connection, 
            Web3.Transaction,
            [senderKeyPair]
        )
    } catch (error) {
        console.log(error)
    }
}

async function pingProgram(payer, programAddress, programDataAddress) 
{
    const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));

    const transaction = new Web3.Transaction();

    const programId = new Web3.PublicKey(programAddress);
    const programDataPublicKey = new Web3.PublicKey(programDataAddress);

    const instruction = new Web3.TransactionInstruction({
        keys: [
            {
                pubkey: programDataPublicKey,
                isSigner: false,
                isWritable: true
            },
        ],
        programId
    });

    transaction.add(instruction);

    const sig = await Web3.sendAndConfirmTransaction(connection, transaction, [payer]);

    console.log(sig);
}

// printBalance('CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN');
// isAccountExecutable('CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN');
// generateKeyPair();
// sendTransaction('CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN', 0.00000144)

const payer = await initializeKeypair();

const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));

//returns error if payes can't pay for the fees
await connection.requestAirdrop(payer.publicKey, Web3.LAMPORTS_PER_SOL*1);

await pingProgram(payer, PROGRAM_ADDRESS, PROGRAM_DATA_ADDRESS);


