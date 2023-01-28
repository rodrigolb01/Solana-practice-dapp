import * as Web3 from "@solana/web3.js";

var address;
var balance;

const setBalance = (val) => {
    balance = val;
}

const printBalance = async(address) => {
    await getBalanceUsingWeb3(address);
    console.log(`balance of account ${address} : ${balance}`);
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

async function getAccountInfoUsingWeb3(address)
{
    try {
        const key = new Web3.PublicKey(address);
        const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));
        connection.getAccountInfo(key).then(res => {
            console.log(`account ${address} is executable? ${res.executable}`);
        });
    } catch (error) {
        console.log('failed to get account info');
    }
}

printBalance('CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN');
getAccountInfoUsingWeb3('CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN');