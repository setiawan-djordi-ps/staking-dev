import Head from "next/head";
import StakingDashboard from "../../components/staking-dashboard";
import AlertTemplate from "react-alert-template-basic";
import { positions, Provider } from "react-alert";
import { useEffect } from "react";
import useWalletConnect from "../../hooks/useWalletConnect";
// import GradientShader from "../../components/Shader/gradient";
import PageBackground from "../../components/background";

const options = {
    timeout: 3000,
    position: positions.BOTTOM_CENTER
  };

function StakingHome() {
  
  const walletConnect = useWalletConnect({}); 
  
  useEffect(() => {
    walletConnect.walletExists();
    return () => { }
  }, [walletConnect]);

  return (
    <Provider template={AlertTemplate} {...options}>
        <Head>
            <title>Staking Dashboard</title>
            <meta name="description" content="Project SEED Staking Dashboard" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        {/* <GradientShader/> */}
        <PageBackground/>
        <StakingDashboard />
    </Provider>
  )
}

export default StakingHome;