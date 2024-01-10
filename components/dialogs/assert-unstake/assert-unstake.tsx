import React, { MouseEvent, PropsWithChildren, useState } from 'react';
import Image from 'next/image'
import Modal from '../../modal';
import styles from './assert-unstake.module.scss';
import ActionButton from '../../shared/action-button';
import CloseButton from '../close/close-button';
import { DialogProps } from '../confirm-stake/stake-shill';
import WarningButton from '../../shared/warning-button';
import ProgressDots from '../../shared/custom-progress';

function AssertConfirmUnstake({ show, onClose, onConfirmUnstake, unstakeAmount, progress }: DialogProps) {


  return (
    <Modal isOpen={show} noContentStyle borderColor={'#E2D087'}>
        <div className={styles["unstake-root"]}>
        {progress? 
            <div className={styles["progress-dot-container"]}>
                <ProgressDots />
            </div>
            :
            <>            
                <div className={styles["unstake-close-btn-parent"]}>
                    <CloseButton onClick={onClose} style={{color: '#E2D087'}} warning />
                </div>
                <div className={styles["unstake-confirm-title-parent"]}>
                    <div className={styles["unstake-confirm-title"]}> 
                        CONFIRMATION
                    </div>
                </div>        

                {/* Available balance */}
                <div className={styles["unstake-amount-parent"]}>
                    <div>Unstake amount:</div>
                    <div className={styles["unstake-shill-amount-item"]}>
                        <p><Image src="/SHILL_Logo.svg" alt="SHILL" width={24} height={24} /> &nbsp; {unstakeAmount}</p>
                    </div>
                </div>
                <br/>
                <div className={styles["unstake-amount-desc"]}>Unstaked assets will be transferred to your account.</div>
                <br/>
                <div className={styles["btn-container"]}>
                    <WarningButton style={{margin: '16px 0px',height:'45px'}} onClick={onConfirmUnstake}>Confirm Unstake</WarningButton>
                    <div className={styles["btn-back"]} onClick={onClose}>
                        Back
                    </div>
                </div>
                </>
            }
        </div>
    </Modal>
  )
}

export default AssertConfirmUnstake;