import { FC, ReactNode } from 'react';
import * as Web3 from '@solana/web3.js';
import { WalletProvider, ConnectionProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import { BalanceDisplay } from './BalanceDisplay';
import Head from 'next/head';
require('@solana/wallet-adapter-react-ui/styles.css');

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const connection = Web3.clusterApiUrl('devnet');
    const publicKey = new walletAdapterWallets.PhantomWalletAdapter();

    return (
        <div>
            <div>
                <Head>
                    <title>Wallet-Adapter Example</title>
                    <meta
                        name="description"
                        content="Wallet-Adapter Example"
                    />
                </Head>
                <ConnectionProvider endpoint={connection}>
                    <WalletProvider wallets={[publicKey]}>
                        <BalanceDisplay></BalanceDisplay>
                    </WalletProvider>
                </ConnectionProvider>
            </div>
        </div>
    )
}

export default WalletContextProvider