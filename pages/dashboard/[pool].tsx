import Head from "next/head";
import React, { useEffect } from 'react'
import AlertTemplate from "react-alert-template-basic";
import { positions, Provider } from "react-alert";
import StakingDetail from "../../components/stake/staking-detail";
import useWalletConnect from "../../hooks/useWalletConnect";
import { useRouter } from "next/dist/client/router";
import { WALLET_PARAMS } from "..";
import GradientShader from "../../components/Shader/gradient";

const options = {
    timeout: 3000,
    position: positions.BOTTOM_CENTER
  };

function StakingPool() {
  const walletConnect = useWalletConnect({});
  
  useEffect(() => {
    walletConnect.walletExists();
    return () => {}
  }, [walletConnect]);
  
  return (
    <Provider template={AlertTemplate} {...options}>
      <Head>
          <title>Staking Pool</title>
          <meta name="description" content="Project SEED Staking Dashboard" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <GradientShader/>
      <StakingDetail />
    </Provider>
  )
}

export default StakingPool;