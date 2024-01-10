import React, { useState } from 'react'
import getPhantom from '../getPhantom';
import Config from '../constants/config';
import { useRouter } from 'next/dist/client/router';
import { WALLET_PARAMS } from '../pages';
import { AnchorProvider,Provider as Prov } from "@project-serum/anchor";
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'

interface IWalletConnect {
    handleConnectPhantomSuccess?: (web3Account: any, provider: any) => void;
    handleConnectPhantomProgress?: (progress: boolean) => void;
    handleConnectPhantomFailure?: (error: Error) => void;
}

function useWalletPhantomConnect({
    handleConnectPhantomSuccess = () => {},
    handleConnectPhantomProgress = () => {},
    handleConnectPhantomFailure = () => {},
  }: IWalletConnect) {

    const [web3Account, setWeb3Account] = useState();
    const [provider, setProvider] = useState<Prov>();
    const router = useRouter();

    const opts = {
        preFlightCommitment: "processed"
    }

    const [isConnecting, setIsConnecting] = useState(false);

    const connectWallet = async () => {
        if (isConnecting) return;
        setIsConnecting(true);
        handleConnectPhantomProgress(true);
        try {
            console.log("Connecting to Phantom")
            const provider: any = await getPhantom();
            const resp = await window.solana.connect();
            
            const account = resp.publicKey.toString();
            //const account = accounts[0];
            const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/5l3qCGN20KYEMwm2PLLHc6AK1ENouNDf', {commitment: 'processed', wsEndpoint: 'wss://solana-mainnet.g.alchemy.com/v2/5l3qCGN20KYEMwm2PLLHc6AK1ENouNDf'});
            
            //@ts-ignore
            const providers = new AnchorProvider(connection, provider, opts.preFlightCommitment)
            console.log("Connected to Phantom", providers)
            setWeb3Account(account)
            console.log("Connected to Phantom", account)
            setProvider(providers);
            handleConnectPhantomSuccess(account, providers);
        } catch(err) {
            handleConnectPhantomFailure(new Error('Please install phantom!'));
        }
        handleConnectPhantomProgress(false);
        setIsConnecting(false);
    }

    const walletExists = () => {
        console.log("Wallet Exists"+router.query[WALLET_PARAMS]);
        if (router.isReady && !router.query[WALLET_PARAMS]) {
            router.push('/');
        }
    }

  return {
      web3Account,
      connectWallet,
      walletExists,
      isConnecting
  }
}

export default useWalletPhantomConnect