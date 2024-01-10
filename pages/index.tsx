import Head from "next/head";
import Link from 'next/link'
import styles from "../styles/Home.module.scss";
import { positions, Provider, useAlert } from "react-alert";
import ConnectWallet from "../components/connect-wallet";
import ConnectWalletTrust from "../components/connect-wallet-trustwallet";
import ConnectWalletPhantom from "../components/connect-wallet-phantom";
import StakingTitle from "../components/staking-title";
import useWalletConnect from "../hooks/useWalletConnect";
import GradientShader from "../components/Shader/gradient";

import { useRouter } from "next/dist/client/router";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useAppContext } from "../context/state";


// solana-js
import useWalletPhantomConnect from "../hooks/useWalletPhantomConnect";
import PageBackground from "../components/background";
import ComingSoonDialog from "../components/dialogs/coming-soon/coming-soon";

export const WALLET_PARAMS = "wallet";

export default function Home() {
    
    const router = useRouter();
    const { setWeb3Account } = useAppContext();
    const { setWeb3SolAccount } = useAppContext();
    const { setProvider } = useAppContext();
    const alert = useAlert();

    // Create state to hold the countdown time
    const [countdown, setCountdown] = useState<number | null>(10);

    // Calculate the target date and time
    // const targetDate = useMemo(() => {
    //     // Note: You may need to adjust this to match the exact time zone offset for Jakarta
    //     return new Date(Date.UTC(2023, 7, 10, 13, 0, 0)); // 8 pm Jakarta time on August 10, 2023
    // }, []);

    // Set up a timer to update the countdown
    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         const now = new Date();
    //         const remainingTime = targetDate.getTime() - now.getTime();
    //         if (remainingTime <= 0) {
    //             setCountdown(0);
    //             clearInterval(timer);
    //         } else {
    //             setCountdown(remainingTime);
    //         }
    //     }, 1000);

    //     return () => clearInterval(timer); // Clean up on unmount
    // }, [targetDate]);

    // const formatTime = (time: number) => {
    //     const days = Math.floor(time / (24 * 3600000));
    //     const hours = Math.floor((time - days * 24 * 3600000) / 3600000);
    //     const minutes = Math.floor((time - days * 24 * 3600000 - hours * 3600000) / 60000);
    //     const seconds = Math.floor((time - days * 24 * 3600000 - hours * 3600000 - minutes * 60000) / 1000);
    //     return `${days.toString().padStart(2, '0')} : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
    // };

    const launchDashboard = useCallback((web3Account) => {
        router.push(`/dashboard/?${WALLET_PARAMS}=${web3Account}`);
    }, []);

    const launchDashboardSol = useCallback((web3Account) => {
        router.push(`/dashboard-sol/?${WALLET_PARAMS}=${web3Account}`);
    }, []);

    const handleConnectSuccess = (web3Account, provider) => {
        console.log("Connect success");
        setWeb3Account(web3Account);
        setProvider(provider);
        launchDashboard(web3Account);
    }

    const handleConnectProgress = () => {
        console.log("Wallet connect progress");
    }
    
    const handleConnectFailure = (err) => {
        console.error("Wallet connect failure", err);
        alert.show('Please install metamask!');
    }

    const walletConnect = useWalletConnect({
        handleConnectSuccess,
        handleConnectProgress,
        handleConnectFailure
    });

    const handleConnectPhantomSuccess = (web3Account, provider) => {
        console.log("Connect Phantom success",provider);
        setWeb3SolAccount(web3Account);
        setProvider(provider)
        launchDashboardSol(web3Account);
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

    function handleMetamaskClick() {
        console.log("Metamask click");
        alert.show("Connecting to Metamask");
        walletConnect.connectWallet();
    }

    function handlePhantomClick() {
        console.log("Phantom click");
        alert.show("Connecting to Phantom");
        walletPhantomConnect.connectWallet();
    }

    useEffect(() => {
        const web3Account = router.query[WALLET_PARAMS];
        console.log("Check On refresh: "+web3Account);
        if (web3Account) {
            setWeb3Account(web3Account);
            launchDashboard(web3Account);
        }

    }, []);

    return (
            <div>
                <ComingSoonDialog show={false}/>
                <PageBackground/>
                <div className={styles.container}>
                    <Head>
                        <title>Staking Home</title>
                        <meta name="description" content="Project SEED Staking Dashboard" />
                        <link rel="icon" href="/favicon.ico" />
                    </Head>

                    <div className={styles['staking-home-container']}>
                    
                        <div className={styles['wallet-container']}>
                            <h3 className={styles['text-color']}>Connect Your Wallet.</h3>
                            <h4 className={styles['text-color']}>Connect with one of our available wallet provider</h4>
                            <ConnectWallet
                                onMetamaskClick={handleMetamaskClick}
                                onWalletTrustClick={handleMetamaskClick} />
                            <ConnectWalletTrust
                                onMetamaskClick={handleMetamaskClick}
                                onWalletTrustClick={handleMetamaskClick} />
                            <ConnectWalletPhantom
                                onPhantomClick={handlePhantomClick} />
                        </div>
                    </div>
                </div>
            </div>
    );
}