import React from 'react'
import styles from './connect-wallet.module.scss';
import Image from 'next/image';


const ConnectWalletDialog = (props) => {

  return (
    <>
        <div className={styles["content-body"]}>
            <hr/>
            <p >If you don&#39;t have one, select a provider and create a new wallet.</p>
            <hr/>
            <div onClick={props.onPhantomClick}>
                <Image src="/icon/phantom-icon-new.svg" width={30} height={30} alt="phantom icon"/>
                    Phantom Wallet
                <Image src="/icon/solana-icon.png" width={25}  height={25} alt="solana icon"/>
            </div>
            <div onClick={props.onMetamaskClick}>
                <Image src="/icon/metamask-icon.png" width={25}  height={25} alt="metamask" />
                    Metamask Wallet
                <Image src="/icon/binance-icon.png" width={25}  height={25} alt="binance"/>
            </div>
            <div onClick={props.onMetamaskClick}>
                <Image src="/icon/trust-wallet-icon.svg" width={25}  height={25} alt="metamask" />
                    Trust Wallet
                <Image src="/icon/binance-icon.png" width={25}  height={25} alt="binance"/>
            </div>
        </div>
    </>
  )
}

export default ConnectWalletDialog