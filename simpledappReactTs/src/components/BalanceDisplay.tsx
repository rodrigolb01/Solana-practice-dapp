import * as Web3 from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from 'react';
import { Buffer } from "buffer";
Buffer.from('anything', 'base64');
//buffer is not defined?
window.Buffer = window.Buffer || Buffer;


export const BalanceDisplay: FC = () => {
    const [balance, setBalance] = useState(0);
    const [amountToTransfer, setAmountToTransfer] = useState(0);
    const [toPublicKey, setToPublicKey] = useState('');
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    useEffect(() => {
        if (!connection || !publicKey) {
            return
        };
        connection.getAccountInfo(publicKey).then(balance => { setBalance(balance ? balance.lamports : 0) });
    }, [connection, publicKey]);

    const sendSol = (event: any) => {
        event.preventDefault()

        console.log('button pressed')
        if (!connection || !publicKey) {
            return
        };

        console.log('sending transaction')
        const transaction = new Web3.Transaction()
        const fromPublicKey = publicKey
        const signer = process.env.REACT_APP_PRIVATE_KEY

        if (!toPublicKey || !fromPublicKey || !signer) {
            console.log('missing fields')
            return;
        }
        const sendSolInstruction = Web3.SystemProgram.transfer({
            fromPubkey: new Web3.PublicKey(fromPublicKey),
            toPubkey: new Web3.PublicKey(toPublicKey),
            lamports: Web3.LAMPORTS_PER_SOL * 0.01
        })

        console.log('adding transaction')

        transaction.add(sendSolInstruction);

        console.log('signing')


        sendTransaction(transaction, connection).then(sign => {
            console.log(sign);
        })
    }

    function ShowSendSolButton() {
        if (!connection || !publicKey) {
            return <p></p>
        };

        return <button onClick={sendSol}>SendSol</button>
    }

    const onClick = async () => {
        if (!connection || !publicKey) { return }
        const id = process.env.REACT_APP_PROGRAM_ID;
        // const data = process.env.REACT_APP_PROGRAM_DATA;
        const data = toPublicKey;

        if (!id || !data) {
            console.log('not connected yet. Cant call ping function');
            return;
        }

        const programId = new Web3.PublicKey(id)
        const programDataAccount = new Web3.PublicKey(data)
        const transaction = new Web3.Transaction()

        const instruction = new Web3.TransactionInstruction({
            keys: [
                {
                    pubkey: programDataAccount,
                    isSigner: false,
                    isWritable: true
                },
            ],
            programId
        });

        transaction.add(instruction)
        await sendTransaction(transaction, connection).then(sig => {
            console.log(sig)
        })
    }

    return (
        <div>
            <p>{publicKey ? `Balance: ${balance / Web3.LAMPORTS_PER_SOL} SOL` : ''}</p>
            <p>{publicKey ? `your publicKey: ` + publicKey.toString() : ''}</p>
            <ShowSendSolButton />
            <div>
                <h4>Transfer Sol</h4>
                <div>
                    <label>Account</label>
                    <input type={'text'} onChange={(e) => { setToPublicKey(e.target.value) }} value={toPublicKey}></input>
                </div>
                <div>
                    <label>Amount</label>
                    <input type={'number'} onChange={(e) => { setAmountToTransfer(Number(e.target.value)) }} value={amountToTransfer}></input>
                </div>
                <button onClick={sendSol}>send</button>
            </div>
        </div>
    )
}