import React, { useState } from 'react'
// import GradientShader from '../../components/Shader/gradient'
import Swap from '../../components/swap';
import styles from './swap.module.scss';
import Modal from '../../components/modal';
import ConnectWalletDialog from '../../components/dialogs/connect-wallet/connect-wallet';
import SelectToken from '../../components/dialogs/select-token/select-token';
import Image from 'next/image';
import PageBackground from '../../components/background';




const TokenData = [
    {
        token_name:'SHILL',
        image:'/icon/shill-token-icon.svg',
        value:10
    },
    {
        token_name:'Solana',
        image:'/icon/solana-icon.png',
        value:200
    },
    {
        token_name:'SHILL',
        image:'/icon/shill-token-icon.svg',
        value:10
    },
    {
        token_name:'Solana',
        image:'/icon/solana-icon.png',
        value:200
    },
    {
        token_name:'SHILL',
        image:'/icon/shill-token-icon.svg',
        value:10
    },
    {
        token_name:'Solana',
        image:'/icon/solana-icon.png',
        value:200
    },
    {
        token_name:'SHILL',
        image:'/icon/shill-token-icon.svg',
        value:10
    },
    {
        token_name:'Solana',
        image:'/icon/solana-icon.png',
        value:200
    }
]


const SwapPage = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeTokenModal, setIsChangeTokenModal] = useState(false);
  const [dataFromChild, setDataFromChild] = useState('');

  const handleDataFromChild = (childData) => {
    //  setDataFromChild(childData);
     setIsChangeTokenModal(true);
  };


  const openModal = () => {
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
  };


  
  return (
    <>
        <PageBackground/>
        <div className={styles["container"]}>
             <Modal isOpen={isModalOpen} title="CONNECT WALLET" onClose={closeModal}>
                <ConnectWalletDialog />
            </Modal>
            <Modal isOpen={isChangeTokenModal} title="SELECT TOKEN" onClose={() => setIsChangeTokenModal(false)}>
                <SelectToken token_data={TokenData}/>
            </Modal>
            <div className={styles["swap-title-style"]}>
                <h1>Swap</h1>
                <p>Trade tokens in an instant, Powered by Project SEED</p>
                <div className={styles["swap-image-mobile-style"]}>
                    <Image src={'/assets/swap-shill-image-mobile.svg'} width={150} height={150} alt="Swap SHILL Image"/>
                </div>
            </div>
            <Swap token_data={TokenData} onConnectWallet={openModal} setOnChangeToken={handleDataFromChild}/>
            <div className={styles["swap-image-style"]}>
                <Image src={'/assets/swap-shill-image.svg'} width={600} height={600} alt="Swap SHILL Image"/>
            </div>
        </div>
    </>
  )
}

export default SwapPage