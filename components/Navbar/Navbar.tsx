import React, { Fragment, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.scss";
// import CustomButton from "../shared/custom-button";
import { useAppContext } from "../../context/state";
import { STEP } from "../../constants";
import { useRouter } from "next/dist/client/router";
import useAccount from "../../hooks/useAccount";
import useAccountSol from "../../hooks/useAccount";
import Modal from "../modal";
import { AiOutlineMenu } from "react-icons/ai";
import { MdOutlineClose } from "react-icons/md";
import { positions, Provider, useAlert } from "react-alert";
// import ActionButton from "../shared/action-button";

import { useSpring, animated  } from '@react-spring/web';
import ConnectWalletDialog from "../dialogs/connect-wallet/connect-wallet";
import { FaArrowLeft } from "react-icons/fa";
import { useMediaQuery } from 'react-responsive';

import useWalletConnect from "../../hooks/useWalletConnect";
import useWalletPhantomConnect from "../../hooks/useWalletPhantomConnect";

import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'


const WalletDisplay = ({address,web3Account}) => (
    <div className={styles["mobile-view"]}>
        <div className={styles["wallet-connect"]}>
            <div className={styles["flex-container"]}>
                
                <div className={styles["solana-wrapper-div"]}>
                    <Image src={web3Account ? '/solana-logo.png' : '/icon/binance-icon.png'} height={30} width={30} alt="Solana Logo" />
                    <span className={styles["solana-text"]}>SOLANA</span>
                </div>
                <div className={styles["phantom-wallet-wrapper-div"]}>
                    <img src={web3Account ? '/phantom-icon-new.svg' : '/fox-icon.svg'} width={30} height={30} style={{marginRight:"5px"}} alt="Phantom Icon"/>
                    {address}
                </div>
            </div> 
        </div>
    </div>
)

const checkActive = (active: string, setActive: (arg0: string) => void, router: { pathname: any; }) => {
    switch (router.pathname) {
        case '/':
            if (active !== 'Staking') setActive('Staking');
            break;
        case '/dashboard-sol':
            if (active !== 'Staking') setActive('Staking');
            break;
        case '/dashboard-sol/[pool]':
            if (active !== 'Staking') setActive('Staking');
            break;
        case '/dashboard':
            if (active !== 'Staking') setActive('Staking');
            break;
        case '/dashboard/[pool]':
            if (active !== 'Staking') setActive('Staking');
            break;
        // case '/swap':
        //     if (active !== 'Swap') setActive('Swap');
        //     break;
        case '/help-center':
            if (active !== 'Help Center') setActive('Help Center');
            break;
        case '/help-center/table-of-content':
            if (active !== 'Help Center') setActive('Help Center');
            break;
        default:
            setActive('');
    }
};

const SideBar = ({activeLink,isOpen,handleToggle, walletAddress,openWallet , web3Account,handleDisconnectWallet}) => {

    const [translateXValue, setTranslateXValue] = useState(0);
    useEffect(() => {
        const handleResize = () => {
          const deviceWidth = window.innerWidth;
          setTranslateXValue(deviceWidth);
        };
    
        handleResize();
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarAnimation = useSpring({
        transform: isOpen ? `translateX(0px)` : `translateX(${translateXValue}px)`,
        reverse:!isOpen,
    });

   const generateLink = (index:number) => {
        switch (index) {
            // case 0: return '/swap';
            case 0: return '/';
            case 1: return '/help-center';        
            default: return '/';
        }
    }

    return (
        <>
            <animated.div className={styles["sidebar"]} style={sidebarAnimation}>
                <div className={styles["sidebar-header"]}>
                    { web3Account ?  <WalletDisplay address={walletAddress} web3Account={!web3Account.toString().startsWith("0x")}/> : <div></div>}
                    <MdOutlineClose color="#208A5C" onClick={handleToggle} size={35}/>
                </div>
                <div className={styles["sidebar-body"]}>
                    <ul className={styles["sidebar-list"]}>
                        {['Staking','Help Center'].map((item,index) => (
                            <li key={index}
                                className={activeLink === item ? styles["list-style"] : ''}
                            >
                                 <Link href={generateLink(index)} passHref>
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                { web3Account ? 
                    <div className={styles["sidebar-web3-account"]}>
                        <div onClick={openWallet}>
                            <img src="/icon/wallet.svg" width={20} height={20} alt="change wallet icon" />
                            <p>Change Wallet</p>
                        </div>
                        <div onClick={handleDisconnectWallet}>
                            <img src="/icon/logout.svg" width={20} height={20} alt="logout icon" />
                            <p>Disconnect Wallet</p>
                        </div>
                    </div>
                  :
                  <div className={styles["sidebar-connect-wallet"]} onClick={openWallet}>
                        Connect Wallet
                  </div>
                }
                
                <div className={styles["sidebar-backdrop-filter"]}></div>
            </animated.div>
        </>
    );
}

export const WALLET_PARAMS = "wallet";

const Navbar = (props) => {
    
    const { setCurrentStep, setWeb3Account, web3Account, provider } = useAppContext();
    const [showDisconnect, setShowDisconnect] = useState(false);
    const router = useRouter();
    let walletBalances: number | BigInt = 0;

    const { setWeb3SolAccount, web3SolAccount } = useAppContext();
    const { setProvider } = useAppContext();
    const alert = useAlert();

    const launchDashboard = useCallback((web3Account) => {
        router.push(`/dashboard/?${WALLET_PARAMS}=${web3Account}`);
    }, []);

    const launchDashboardSol = useCallback((web3Account) => {
        router.push(`/dashboard-sol/?${WALLET_PARAMS}=${web3Account}`);
    }, []);

    const handleConnectSuccess = (web3Account, provider) => {
        console.log("Connect success");
        setWeb3Account(web3Account);
        setProvider(provider)
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
        setIsModalOpen(false);
        walletConnect.connectWallet();
    }

    function handlePhantomClick() {
        console.log("Phantom click");
        alert.show("Connecting to Phantom");
        setIsModalOpen(false);
        walletPhantomConnect.connectWallet();
    }

    async function getWeb3Modal() {
        const providerOptions = {
          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: "4a2b2f588c424e8c939bec2046a4d5c4",
            },
          },
        }
        const web3modal = new Web3Modal({
          cacheProvider: true,
          providerOptions, // required
        })
        return web3modal;
      }



    
   
    const { stakingTokenAddr, rewardTokenAddr  } = router.query;
    // Update the document title using the browser API
    
    const { walletBalance } = useAccountSol();
    walletBalances = walletBalance;
    const handleDisconnectWallet = async() => {

        if(!web3SolAccount){
            const web3modal = await getWeb3Modal();
            if (web3modal) {
                web3modal.clearCachedProvider()
                if (provider?.disconnect && typeof provider.disconnect === 'function') {
                    await provider.disconnect()
                }
            }
        }
        setWeb3Account(null); //Clear current wallet
        setWeb3SolAccount(null);
        setProvider(null);
        setCurrentStep(STEP.STEP_1); //Go back home
        router.push("/");
    }

    const handleClick = () => {
        setShowDisconnect(!showDisconnect);
    };

    const handleBackHome = () => {

        if(web3SolAccount){
            router.push(`/dashboard-sol/?${WALLET_PARAMS}=${web3SolAccount}`);
        }else if(web3Account){
            router.push(`/dashboard/?${WALLET_PARAMS}=${web3Account}`);
        }else{
            router.push("/");
        }
        
    };

    const formatString = (str) => {
        if (str.length <= 6) {
          return str;
        }
        return str.slice(0, 3) + '...' + str.slice(-3);
    };
    
    const rotate = useSpring({
        from:{ transform: 'rotate(0deg)'},
        to:{ transform: `rotate(${showDisconnect ? '-180' : '0'}deg)`}
    });

    const dropDownAnim = useSpring({
        height: showDisconnect ? '115px' : '0px',
        paddingTop: showDisconnect ? '30px' : '22px',
        reverse: !showDisconnect
    })
   
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    const handleSideBarToggle = () => {
        setIsSideBarOpen(!isSideBarOpen);
    };
    
    const  [activeLink, setActiveLink] = useState('/');
    useEffect(() => {
        checkActive(activeLink, setActiveLink, router);
    }, [router.pathname]);
    
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return ( 
        <Fragment>
            
            <Modal isOpen={isModalOpen} title="CONNECT WALLET" onClose={closeModal}>
                <ConnectWalletDialog onPhantomClick={handlePhantomClick} onMetamaskClick={handleMetamaskClick}/>
            </Modal>
            <nav className={styles["navbar-container"]}>
                <div className={styles["navbar-sub-container"]}>
                    <div style={{display:'flex',alignItems:'center', justifyContent:'start'}}>
                        {
                            stakingTokenAddr !== undefined && rewardTokenAddr !== undefined && isMobile ?
                            <Link href={`${web3Account && !web3Account.toString().startsWith("0x") ? `/dashboard-sol/?wallet=${web3Account}` : `/dashboard/?wallet=${web3Account}`}`} passHref>
                                <FaArrowLeft color="#208A5C" size={30}/> 
                             </Link>
                             :
                            <div onClick={handleBackHome}>
                                <picture>
                                    <source media="(max-width: 768px)" srcSet="/icon/shill-small-icon.svg" className={styles["small-logo"]}/>
                                    <source media="(max-width: 1024px)" srcSet="/icon/shill-small-icon.svg" className={styles["logo"]}/>
                                    <img alt="Project Seed Logo" src="/ps-logo.png" className={styles["logo"]} draggable={false}/>
                                </picture>
                            </div>
                        }
                        <ul className={styles["desktop-link"]}>    
                            {/* <Link href={'/swap'} passHref> 
                                <li className={activeLink === 'Swap' ? styles["list-style-desktop"] : ''}>
                                    Swap
                                </li>
                            </Link> */}
                            <Link href={'/'} passHref> 
                                <li className={activeLink === 'Staking' ? styles["list-style-desktop"] : ''}>
                                    Staking
                                </li>
                            </Link>
                        </ul>
                    </div>
                    { web3Account ? ( 
                        <>
                            {/* <div style={{display: 'flex', flexGrow: 1}}/> */}
                    
                            <div className={styles["wallet-item"]} >
                                <Link href="/help-center" passHref>
                                    <div className={styles["help-center"]}>
                                        Help Center
                                    </div>
                                </Link>
                                <div className={styles["wallet-connect"]} onClick={handleClick}>
                                    { !web3Account.toString().startsWith("0x") ?
                                        <div className={styles["flex-container"]}>
                                            <div className={styles["solana-wrapper-div"]}>
                                                <Image src="/solana-logo.png" height={25} width={25} alt="Solana Logo" />
                                                <span className={styles["solana-text"]}>SOLANA</span>
                                            </div>
                                            <div className={styles["phantom-wallet-wrapper-div"]}>
                                                <img src="/phantom-icon-new.svg" width={25} height={25} style={{marginRight:"5px"}} alt="Phantom Icon"/>
                                                {formatString(web3Account)}
                                                <animated.img 
                                                    src="/icon/chevron-down.svg" 
                                                    width={15} 
                                                    style={{ ...rotate, marginLeft:"10px" }}
                                                />
                                            </div>
                                        </div> :
                                        <div className={styles["flex-container"]}>
                                            <Image src="/icon/binance-icon.png" height={25} width={25} alt="Binance Icon" />
                                            <span className={styles["solana-text"]}>BINANCE</span>
                                            <div className={styles["flex-container"]}>
                                                <img src="/fox-icon.svg" width={25} style={{marginRight:"10px"}}/>
                                                {formatString(web3Account)}
                                                <img src="/icon/chevron-down.svg" width={25} />
                                            </div>
                                        </div>
                                    }
                                </div>
                                <animated.div style={{...dropDownAnim}} className={styles["dropdown-content"]} >
                                    <div onClick={openModal}>
                                        <img src="/icon/wallet.svg" width={20} height={20} alt="change wallet icon" />
                                        <p>Change Wallet</p>
                                    </div>
                                    <hr/>
                                    <div onClick={handleDisconnectWallet}>
                                        <img src="/icon/logout.svg" width={20} height={20} alt="logout icon" />
                                        <p>Disconnect Wallet</p>
                                    </div>
                                </animated.div>  
                            </div> 
                        </>
                        ): <>
                            {/* <div className={styles["only-desktop-view"]}></div> */}
                        </>
                    }
                    { web3Account ? <WalletDisplay address={formatString(web3Account)} web3Account={!web3Account.toString().startsWith("0x")}/> :''}
                  
                    <div className={styles["mobile-view"]}> 
                        <SideBar 
                            activeLink={activeLink}
                            handleToggle={handleSideBarToggle}
                            isOpen={isSideBarOpen} 
                            walletAddress={web3Account ? formatString(web3Account) : ''} 
                            openWallet={openModal}
                            web3Account={web3Account}
                            handleDisconnectWallet={handleDisconnectWallet}
                        />
                        <AiOutlineMenu color="#208A5C" size={30} className={styles["menu-icon"]} onClick={handleSideBarToggle}/>
                    </div>
                </div>
            </nav>
            {/* <Fragment>{props.children}</Fragment> */}
            {/* <div className={styles["footer-container"]}>
                <div className={styles["footer-disclaimer"]}>
                    <label>Disclaimer :</label>
                    <p>STAKING IS IN BETA, STAKE AT YOUR OWN RISK!</p>
                </div>
                <div className={styles["footer-links"]}>
                    <Link href="/legal/#staking-agreement" passHref>
                        <a className={styles["footer-link"]}>
                            Staking Agreement
                        </a>
                    </Link>
                    <div/>
                    <Link href="/legal/#terms-of-service" passHref>
                        <a className={styles["footer-link"]}>
                            Terms of Service
                        </a>
                    </Link>
                    <div/>
                    <Link href="/legal/#privacy-policy" passHref>
                        <a className={styles["footer-link"]}>
                            Privacy Policy
                        </a>
                    </Link>
                </div>
                <div className={styles["footer-logo"]}>
                    <Image src="/ps-logo.png" alt="Your Logo" width={150} height={150}/>
                </div>
            </div> */}
        </Fragment>
    );
};

export default Navbar;
