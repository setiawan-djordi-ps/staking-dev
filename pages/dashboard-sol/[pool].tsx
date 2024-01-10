import Head from "next/head";
import React, { useEffect } from 'react'
import AlertTemplate from "react-alert-template-basic";
import { positions, Provider } from "react-alert";
import StakingDetailSol from "../../components/stake/staking-detail-sol";
import useWalletPhantomConnect from "../../hooks/useWalletPhantomConnect";
import { useRouter } from "next/dist/client/router";
import { WALLET_PARAMS } from "..";
import { useAppContext } from '../../context/state'; // Import useAppContext
import GradientShader from "../../components/Shader/gradient";

const options = {
    timeout: 3000,
    position: positions.BOTTOM_CENTER
  };

function StakingPoolSol() {

  const { web3Account,setWeb3SolAccount, setProvider } = useAppContext();

  const handleConnectPhantomSuccess = (web3Account, provider) => {
    console.log("Connect Phantom success",provider);
    setWeb3SolAccount(web3Account);
    setProvider(provider)

  }

  const handleConnectPhantomProgress = () => {
    console.log("Wallet connect progress");
  }

  const handleConnectPhantomFailure = (err) => {
    console.error("Wallet connect failure", err);
  }

  const walletPhantomConnect = useWalletPhantomConnect({
      handleConnectPhantomSuccess,
      handleConnectPhantomProgress,
      handleConnectPhantomFailure
  });
  
  useEffect(() => {
    walletPhantomConnect.walletExists();

    if (!web3Account && !walletPhantomConnect.isConnecting) {
      console.log("try to connect wallet")
      walletPhantomConnect.connectWallet();
    }

    return () => { }
  }, [walletPhantomConnect,web3Account]);
  
  return (
    <Provider template={AlertTemplate} {...options}>
      <Head>
          <title>Staking Pool Solana</title>
          <meta name="description" content="Project SEED Staking Dashboard" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <GradientShader isGradient/>
      <StakingDetailSol />
    </Provider>
  )
}

export default StakingPoolSol;