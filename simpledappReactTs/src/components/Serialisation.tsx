import * as Web3 from '@solana/web3.js';
import { Buffer } from 'buffer';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC } from 'react';
import { Movie } from './models/Movie';
import { useState } from 'react'

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN';


export const Serialisation: FC = () => {

    // window.Buffer = window.Buffer || Buffer
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [movieTitle, setMovieTitle] = useState('');
    const [movieRating, setMovieRating] = useState(0);
    const [movieDescription, setMovieDescription] = useState('');
    const [reviews, setReviews] = useState<Movie[]>([]);


    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!movieTitle || !movieRating || !movieDescription) {
            console.log('invalid fields');
            return;
        }

        const movie: Movie = new Movie(movieTitle, movieRating, movieDescription);
        handleTransactionSubmit(movie);
    }

    const handleTransactionSubmit = async (movie: Movie) => {
        if (!publicKey) {
            console.log('please connect to your wallet');
            return;
        }

        const buffer = movie.serialize();
        const transaction = new Web3.Transaction();

        const [pda] = Web3.PublicKey.findProgramAddressSync(
            [publicKey.toBuffer(), Buffer.from(movie.title)],
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
            let txid = await sendTransaction(transaction, connection); //
            setReviews(reviews => [...reviews, movie]);
            console.log(reviews);
            console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`);

        } catch (error) {
            console.log(JSON.stringify(error));
            return;
        }
    }

    // const renderReviews = () =>{
    //     if()
    // }

    return (
        <div>
            <div>
                <div>
                    <label>Title</label>
                    <input type={'text'} onChange={(e) => { setMovieTitle(e.target.value) }} value={movieTitle}></input>
                </div>
                <br />
                <div>
                    <label>Rating</label>
                    <input type={'number'} onChange={(e) => { setMovieRating(Number(e.target.value)) }} value={movieRating}></input>
                </div>
                <br />
                <div>
                    <label>Description</label>
                    <input type={'text'} onChange={(e) => { setMovieDescription(e.target.value) }} value={movieDescription}></input>
                </div>
                <button onClick={handleSubmit}>send</button>
            </div>
            <div>

            </div>
        </div>
    )
}

export default Serialisation