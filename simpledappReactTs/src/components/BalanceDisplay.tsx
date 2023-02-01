import * as Web3 from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from 'react';
import { Buffer } from 'buffer';
Buffer.from('anything', 'base64');

export const BalanceDisplay: FC = () => {
    const [balance, setBalance] = useState(0);
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    useEffect(() => {
        if (!connection || !publicKey) {
            return
        };
        connection.getAccountInfo(publicKey).then(balance => { setBalance(balance ? balance.lamports : 0) });
    }, [connection, publicKey]);

    const sendSol = (event: any) => {
        console.log('button pressed')
        if (!connection || !publicKey) {
            return
        };

        event.preventDefault()

        const transaction = new Web3.Transaction()
        // const recipientPubKey = new Web3.PublicKey(event.target.recipient.value)

        const sendSolInstruction = Web3.SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: publicKey,
            lamports: Web3.LAMPORTS_PER_SOL * 0.1
        })

        transaction.add(sendSolInstruction);
        sendTransaction(transaction, connection).then(sig => {
            console.log(sig)
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
        const data = process.env.REACT_APP_PROGRAM_DATA;

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
            <button onClick={onClick}>ping</button>
        </div>
    )
}