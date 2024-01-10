import React, { useState } from 'react'
import getWeb3Provider from '../getWeb3';
import Config from '../constants/config';
import { useRouter } from 'next/dist/client/router';
import { WALLET_PARAMS } from '../pages';
import Web3 from 'web3';


interface IWalletConnect {
    handleConnectSuccess?: (web3Account: any, provider: any) => void;
    handleConnectProgress?: (progress: boolean) => void;
    handleConnectFailure?: (error: Error) => void;
}

function useWalletConnect(
    {
        handleConnectSuccess, 
        handleConnectProgress, 
        handleConnectFailure 
    }: IWalletConnect) {

        const [web3Account, setWeb3Account] = useState('');
        const router = useRouter();

    const connectWallet = async () => {
        handleConnectProgress(true);
        try {
            const provider: any = await getWeb3Provider();
            console.log("Provider: ",provider)
            const web3 = new Web3(provider);
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            console.log("Account: ",account)
            setWeb3Account(account);
            handleConnectSuccess(account, provider);
        } catch(err) {
            handleConnectFailure(new Error('Please install metamask!'));
        }
        handleConnectProgress(false);
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
      walletExists
  }
}

export default useWalletConnect