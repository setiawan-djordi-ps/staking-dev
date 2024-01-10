import React, { MouseEvent, PropsWithChildren, useState } from 'react';
import Modal, { ModalType } from '..';
import styles from './stake-success.module.scss';

export interface DialogProps {
  show?: boolean;
  onClose?: () => void;
}

function UnstakeSuccess({ show, onClose }: DialogProps) {

  return (
      <Modal type={ModalType.WARNING} show={show} onClose={onClose}>
        <div className={styles["stake-success-root"]}>
            <div className={styles["title"]}>SHILL UNSTAKED!</div>
            <div>Your tokens have been transferred back to your wallet.</div>
        </div>
      </Modal>
  )
}

export default UnstakeSuccess;