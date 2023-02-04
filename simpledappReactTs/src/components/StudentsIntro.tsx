import { FC } from 'react'
import { Student } from '../components/models/Student'
import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Textarea } from '@chakra-ui/react'
import * as web3 from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

const STUDENT_INTRO_PROGRAM_ID = 'HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf'

export const StudentsIntro: FC = () => {
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const handleSubmit = (event: any) => {
        event.preventDefault()
        const studentIntro = new Student(name, message)
        handleTransactionSubmit(studentIntro)
    }

    const handleTransactionSubmit = async (studentIntro: Student) => {
        if (!publicKey) {
            alert('Please connect your wallet!')
            return
        }

        const buffer = studentIntro.serialize()
        const transaction = new web3.Transaction()

        const [pda] = await web3.PublicKey.findProgramAddress(
            [publicKey.toBuffer(), Buffer.from(studentIntro.name)],
            new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID)
        )

        const instruction = new web3.TransactionInstruction({
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: pda,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: web3.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false
                }
            ],
            data: buffer,
            programId: new web3.PublicKey(STUDENT_INTRO_PROGRAM_ID)
        })

        transaction.add(instruction)

        try {
            let txid = await sendTransaction(transaction, connection)
            alert(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
            console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
        } catch (e) {
            console.log(JSON.stringify(e))
            alert(JSON.stringify(e))
        }
    }

    return (
        <Box
            p={4}
            display={{ md: "flex" }}
            maxWidth="32rem"
            borderWidth={1}
            margin={2}
            justifyContent="center"
        >
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel color='gray.200'>
                        What do we call you?
                    </FormLabel>
                    <Input
                        id='name'
                        color='gray.400'
                        onChange={(event: any) => setName(event.currentTarget.value)}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel color='gray.200'>
                        What brings you to Solana, friend?
                    </FormLabel>
                    <Textarea
                        id='message'
                        color='gray.400'
                        onChange={(event: any) => setMessage(event.currentTarget.value)}
                    />
                </FormControl>
                <Button width="full" mt={4} type="submit">
                    Submit
                </Button>
            </form>
        </Box>
    );
}