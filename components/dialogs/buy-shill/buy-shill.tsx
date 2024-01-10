import React, { ChangeEvent, MouseEvent, MouseEventHandler, PropsWithChildren, useState } from 'react';
import Image from 'next/image'
// import Modal, { ModalType } from '..';
import styles from './buy-shill.module.scss';
import CloseButton from '../close/close-button';
import { DialogProps } from '../confirm-stake/stake-shill';
import ActionButton from '../../shared/action-button';
import Modal from '../../modal';
function BuyShill({ show, onClose }: DialogProps) {

  return (
      // <Modal type={ModalType.DEFAULT} show={show}>
      <Modal isOpen={show}  onClose={onClose}>
        <div className={styles["buy-shill-root"]}>
              {/* <div className={styles["buy-shill-close-btn-parent"]}>
                <CloseButton onClick={onClose} />
              </div> */}
              <div className={styles["buy-shill-title-parent"]}>
                  <Image src="/SHILL_Logo.svg" alt="SHILL" width={32} height={32} />
                  <div className={styles["buy-shill-title"]}>BUY SHILL</div>
              </div>              
              <div>
                  {/* <ActionButton small style={{margin: '16px 0px'}}>
                    <a href='https://www.kucoin.com/trade/SHILL-USDT' style={{color: 'inherit', textDecoration: 'none'}}>KuCoin</a></ActionButton>
                  <ActionButton small><a href='https://apeswap.finance/swap?inputCurrency=0xfb9C339b4BacE4Fe63ccc1dd9a3c3C531441D5fE&outputCurrency=0x55d398326f99059fF775485246999027B3197955' style={{color: 'inherit', textDecoration: 'none'}}>Apeswap</a></ActionButton>
              */}
                <div className={styles["button-style"]}>
                  <a href='https://www.kucoin.com/trade/SHILL-USDT' style={{color: 'inherit', textDecoration: 'none'}}>
                    KuCoin
                  </a>
                </div>
                <div className={styles["button-style"]}>
                  <a href='https://apeswap.finance/swap?inputCurrency=0xfb9C339b4BacE4Fe63ccc1dd9a3c3C531441D5fE&outputCurrency=0x55d398326f99059fF775485246999027B3197955' 
                    style={{color: 'inherit', textDecoration: 'none'}}>
                    Apeswap
                  </a>
                </div>
              </div>
        </div>
    </Modal>
  )
}

export default BuyShill;