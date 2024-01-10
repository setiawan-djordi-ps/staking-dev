import React, { MouseEvent, PropsWithChildren, useState } from 'react';
import Image from 'next/image'
import Modal, { ModalType } from '..';
import styles from './stake-success.module.scss';
import ActionButton from '../../shared/action-button';
import CloseButton from '../close/close-button';

export interface DialogProps {
  show?: boolean;
  onClose?: () => void;
  progress?: boolean
}

function StakeSuccess({ show, onClose }: DialogProps) {

  return (
      <Modal type={ModalType.DEFAULT} show={show} onClose={onClose}>
        <div className={styles["stake-success-root"]}>
            <div className={styles["title"]}>STAKING COMPLETE!</div>
            <div>Your SHILL is now staked!</div>
        </div>
      </Modal>
  )
}

export default StakeSuccess;