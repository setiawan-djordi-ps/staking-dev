import React from 'react'
import Modal, { ModalType } from '../dialogs';
import { DialogProps } from '../dialogs/stake-success/stake-success';
import ProgressDots from './custom-progress';
import styles from './progress-dialog.module.scss';

function ProgressDialog({show, onClose}: DialogProps) {
  return (
    <Modal type={ModalType.DEFAULT} show={show} onClose={onClose}>
        <div className={styles["progress-dialog-root"]}>
            <ProgressDots />
        </div>
    </Modal>
  )
}

export default ProgressDialog;