import React from 'react'
import Modal, { ModalType } from '..';
import { DialogProps } from '../stake-success/stake-success';
import styles from './rewards-claimed.module.scss';

function RewardsClaimed( {show, onClose}: DialogProps) {
  return (
    <Modal type={ModalType.DEFAULT} show={show} onClose={onClose}>
        <div className={styles["rewards-claimed-root"]}>
            <div className={styles["title"]}>REWARDS CLAIMED</div>
            <div>You have successfully claimed your rewards to your wallet.</div>
        </div>
    </Modal>
  )
}

export default RewardsClaimed;