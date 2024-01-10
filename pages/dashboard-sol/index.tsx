import Head from "next/head";
import StakingDashboardSol from "../../components/staking-dashboard-sol";

import AlertTemplate from "react-alert-template-basic";
import { positions, Provider, useAlert } from "react-alert";
import { useEffect } from "react";
import useWalletPhantomConnect from "../../hooks/useWalletPhantomConnect";
import { useAppContext } from '../../context/state'; // Import useAppContext

// import GradientShader from "../../components/Shader/gradient";
import PageBackground from "../../components/background";

const options = {
    timeout: 3000,
    position: positions.BOTTOM_CENTER
  };

function StakingHomeSol() {

  const { web3Account,setWeb3SolAccount, setProvider } = useAppContext();

  const alert = useAlert();

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
    alert.show('Please install phantom!');
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
            <title>Staking Dashboard Solana</title>
            <meta name="description" content="Project SEED Staking Dashboard" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageBackground/>
        <StakingDashboardSol />
    </Provider>
  )
}

export default StakingHomeSol;