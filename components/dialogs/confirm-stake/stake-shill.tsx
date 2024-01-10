import React, { ChangeEvent, MouseEvent, MouseEventHandler, PropsWithChildren, useState, useEffect } from 'react';
import Image from 'next/image'
import Modal, { ModalType } from '..';
import styles from './stake-shill.module.scss';
import ActionButton from '../../shared/action-button';
import CloseButton from '../close/close-button';
import ProgressDots from '../../shared/custom-progress';

export interface DialogProps {
  show?: boolean;
  finish?: boolean;
  walletBalance?: bigint | number;
  onClose?: () => void;
  onStake?: (amount: number | bigint) => void;
  onUnstake?: (event: MouseEvent<HTMLButtonElement>, amount: string) => void;
  onConfirmUnstake?: MouseEventHandler;
  stakePeriodRemaining?: string;
  progress?: boolean;
  unstakeAmount?: string;
  shillStaked?: number;
  setUnstakeAmount?: (amount: string) => void;
  stakingBalance?: number | bigint | string;
}

function ConfirmStakeShill({ show, walletBalance, onClose, onStake, stakePeriodRemaining, progress, shillStaked }: DialogProps) {
  const [amountToStake, setAmountToStake] = useState<number | bigint | string>("");

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue === "") {
      setAmountToStake("");
    } else if (Number(inputValue) > walletBalance) {
      setAmountToStake(BigInt(walletBalance));
    } else {
      setAmountToStake(BigInt(inputValue));
    }
  };

  const handleMaxClick = () => {
    console.log("MAX Clicked");
    setAmountToStake(Math.floor(Number(walletBalance)));
  };

  const handleStakeShill = () => {
    if (amountToStake === "" || Number(amountToStake) <= 0) {
      alert("Please enter a valid staking amount.");
      return;
    }
  
    onStake(amountToStake as bigint);
  };

  useEffect(() => {
    setAmountToStake("");
  }, [show]);

  return (
      <Modal type={ModalType.DEFAULT} show={show}>
        <div className={styles["stake-shill-root"]}>
          {progress? 
            <ProgressDots />:
            <>
              <div className={styles["stake-shill-close-btn-parent"]}>
                <CloseButton onClick={onClose} />
              </div>
              {
                shillStaked <= 0 &&
                <div className={styles["stake-shill-title-parent"]}>
                  <Image src="/SHILL_Logo.svg" alt="SHILL" width={32} height={32} />
                  <div className={styles["stake-shill-title"]}>STAKE SHILL</div>
                </div> 
              }
              
              {
                shillStaked > 0 &&
                <div className={styles["stake-shill-title-parent"]}>
                  <Image src="/SHILL_Logo.svg" alt="SHILL" width={32} height={32} />
                  <div className={styles["stake-shill-title"]}>STAKE MORE SHILL</div>
                </div> 
              }
                    
              <div className={styles["stake-shill-desc-parent"]}>
                <div style={{textAlign:'center'}}>Your staked SHILL will be locked for {stakePeriodRemaining}. Any unclaimed rewards will be automatically claimed.</div>
              </div>

              <div className={styles["stake-shill-desc-parent-left"]}>
                <div style={{textAlign:'left', display:'flex', width:'100%'}}>
                  
                  <div className={styles["stake-detail-item-text"]}>
                      <p className={styles["stake-detail-field-title"]}>
                      Current Staked Shill:
                      </p>
                  </div>
                  <div className={styles["stake-detail-item"]}>
                      <p className={styles["stake-detail-field-title"]}>
                            <img alt="SHILL-Logo" src="/icon/shill-token-icon.svg" width={20} /> 
                          <span style={{marginLeft: 28}}>{Number(shillStaked).toLocaleString() }</span>
                      </p>
                  </div>
                </div>
              </div>

              {/* Available balance */}
              <div className={styles["available-balance-parent"]}>
                {
                  shillStaked > 0 &&
                  <div>Additional Staking Amount:</div>
                }
                {
                  shillStaked <= 0 &&
                  <div>Staking Amount:</div>
                }
                <div className={styles["available-balance-amount"]}>
                  Available : &nbsp; {(walletBalance?.toLocaleString()) ?? "0"} SHILL</div>
              </div>

              {/* Input Amount */}
              <div className={styles["stake-shill-amount-item"]}>
                  <p>
                      <input className={styles["stake-shill-input"]} type="number" min={0} max={Number(walletBalance)} name='Amount' placeholder='Stake amount' value={String(amountToStake)} autoComplete="off" onChange={handleChangeAmount} />
                      <span className={styles["stake-max-button"]} onClick={handleMaxClick}>MAX</span>
                  </p>
              </div>

              <div style={{margin: '32px 0px'}}>
                <div className={styles["stake-button"]} onClick={handleStakeShill}>Stake</div>
              </div>
            </>}
        </div>
    </Modal>
  )
}

export default ConfirmStakeShill;