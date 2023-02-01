import './App.css';
import { NextPage } from 'next';
import React from 'react';
import { FC, ReactNode } from "react";
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import * as Web3 from '@solana/web3.js'
import { BalanceDisplay } from './components/BalanceDisplay';
import { Buffer } from 'buffer';
Buffer.from('anything', 'base64');


const App: NextPage = (props: any) => {
  const endpoint = Web3.clusterApiUrl('devnet')
  const wallet = new PhantomWalletAdapter();


  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[wallet]}>
        <WalletModalProvider>
          <WalletMultiButton />
          <BalanceDisplay></BalanceDisplay>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App;