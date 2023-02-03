import * as Web3 from '@solana/web3.js';
import * as borsh from '@project-serum/borsh';
import { Buffer } from 'buffer';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC } from 'react';
import { Movie } from './models/Movie';
import React from 'react'


export const Serialisation: FC = () => {

    // window.Buffer = window.Buffer || Buffer
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();


    const handleSubmit = (e: any) => {
        e.preventDefault();

        const schema = new Movie('Moonlight ', 5, 'noice');
        handleTransactionSubmit(schema);
    }

    const handleTransactionSubmit = async (schema: Movie) => {
        if (!publicKey) {
            console.log('please connect to your wallet');
            return;
        }

        const buffer = schema.serialize();
        const transaction = new Web3.Transaction();
        const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN';

        const [pda] = await Web3.PublicKey.findProgramAddress(
            [publicKey.toBuffer(), Buffer.from(schema.title)],
            new Web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
        );

        const instruction = new Web3.TransactionInstruction(
            {
                keys: [
                    {
                        pubkey: publicKey,
                        isSigner: true,
                        isWritable: false
                    },
                    {
                        pubkey: pda,
                        isSigner: false,
                        isWritable: true
                    },
                    {
                        pubkey: Web3.SystemProgram.programId,
                        isSigner: false,
                        isWritable: false
                    }
                ],
                data: buffer,
                programId: new Web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
            }
        );

        transaction.add(instruction);

        try {
            let txid = await sendTransaction(transaction, connection);
            console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`);

        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }

    return (
        <div>
            <button onClick={handleSubmit}>send</button>
        </div>
    )
}

export default Serialisation