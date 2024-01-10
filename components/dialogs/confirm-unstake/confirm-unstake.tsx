import React, { ChangeEvent, MouseEvent, PropsWithChildren, useState, useEffect } from 'react';
import Image from 'next/image'
import Modal, { ModalType } from '..';
import styles from './confirm-unstake.module.scss';
import ActionButton from '../../shared/action-button';
import CloseButton from '../close/close-button';
import { DialogProps } from '../confirm-stake/stake-shill';
import WarningButton from '../../shared/warning-button';
import getWeb3 from '../../../getWeb3';
import { BN} from "@project-serum/anchor";


function ConfirmUnstake({ show, stakingBalance, onClose, onUnstake, setUnstakeAmount, finish }: DialogProps) {

    const [amount, setAmount] = useState<string>('');

    console.log('staking balance',stakingBalance)

    const handleChangeAmount = (evt: ChangeEvent<HTMLInputElement>) => {
        // Accept empty string as a valid input.
        setAmount(evt.target.value || '');
    }

    useEffect(() => {
        setAmount(String(stakingBalance));
    }, [stakingBalance]);

    const handleUnstake = (event) => {
        // Validate the input before unstaking.
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid unstake amount.");
            return;
        }
        console.log('amount',amount)
        setUnstakeAmount(amount);
        onUnstake(event, amount);
    }

    const handleWithdraw = (event) => {
        // Validate the input before unstaking.
        setUnstakeAmount(stakingBalance.toString());
        onUnstake(event, stakingBalance.toString());
    }

    const handleSetPercentageAmount = async (event: MouseEvent, percentId: number) => {
        //const web3: any = await getWeb3();
        //const BN = web3.utils.BN;
        const stakingBalanceBN = new BN(String(stakingBalance));
        const percentBN = new BN('100');
        let percentFactorBN, percentageAmount;
        switch(percentId) {
            case 1:
                percentFactorBN = new BN('25')
                console.log(percentFactorBN);
                percentageAmount = percentFactorBN.mul(stakingBalanceBN).div(percentBN);
                console.log(percentageAmount.toString());
                setAmount(percentageAmount.toString());
                break;
            case 2:
                percentFactorBN = new BN('50')
                console.log(percentFactorBN);
                percentageAmount = percentFactorBN.mul(stakingBalanceBN).div(percentBN);
                setAmount(percentageAmount.toString());
                break;
            case 3:
                percentFactorBN = new BN('75')
                console.log(percentFactorBN);
                percentageAmount = percentFactorBN.mul(stakingBalanceBN).div(percentBN);
                setAmount(percentageAmount.toString());
                break;
            case 4:
                setAmount(String(stakingBalance));
                break;
            default:
                setAmount(String(0));
                break;
        }
    }

  return (
    <Modal type={ModalType.WARNING} show={show}>
        <div className={styles["unstake-shill-root"]}>
            <div className={styles["unstake-shill-close-btn-parent"]}><CloseButton onClick={onClose} style={{color: '#7E45FF'}} warning /></div>
            <div className={styles["unstake-shill-title-parent"]}>
            { !finish ? 
                <div className={styles["unstake-shill-title"]}> 
                    <img src='/exclamation.svg' height={24} width={24} /> &nbsp; WARNING &nbsp; <img src='/exclamation.svg' height={24} width={24} />
                </div>
                :
                <>
                    <Image src="/SHILL_Logo.svg" alt="SHILL" width={32} height={32} />
                    <div className={styles["stake-shill-title"]}>WITHDRAW SHILL</div>
                </>
            }
            </div>        
            <div className={styles["unstake-shill-desc-parent"]}>
                { !finish ?
                    <div className={styles["unstake-shill-desc"]}>{`You're about to unstake your SHILL`}</div>
                :
                    <div className={styles["unstake-shill-desc"]}>{`Thank you for staking! Proceed to withdraw your staked tokens back to your wallet. Any unclaimed rewards will be automatically claimed.`}</div>
                }
            </div>


            <div className={styles["stake-shill-desc-parent-left"]}>
                <div style={{textAlign:'left', display:'flex', width:'100%'}}>
                  
                  <div className={styles["stake-detail-item-text"]}>
                      <p className={styles["stake-detail-field-title"]}>
                      Staked Shill:
                      </p>
                  </div>
                  <div className={styles["stake-detail-item"]}>
                      <p className={styles["stake-detail-field-title"]}>
                            <img alt="SHILL-Logo" src="/icon/shill-token-icon.svg" width={20} /> 
                          <span style={{marginLeft: 28}}>{Number(stakingBalance).toLocaleString() }</span>
                      </p>
                  </div>
                </div>
              </div>

            {/* Available balance */}
            { !finish  &&
            <>
                <div className={styles["staking-balance-parent"]}>
                    <div>Staking balance:</div>
                    <div className={styles["staking-balance-amount"]}>
                        <Image src="/SHILL_Logo.svg" alt="SHILL" width={24} height={24} /> &nbsp; {stakingBalance} SHILL
                    </div>
                </div>
                <div className={styles["unstake-shill-amount-item"]}>
                    <p>
                        <input className={styles["unstake-shill-input"]} type="number" name='Amount' autoComplete="off" value={amount} placeholder='Amount to unstake' onChange={handleChangeAmount} />
                        
                    </p>
                </div>
            </>
            }
            
            { !finish ? 
                <div style={{margin: '32px 0px'}}>
                    <WarningButton onClick={handleUnstake}>Unstake</WarningButton>
                </div>
            :
                <div style={{margin: '32px 0px'}}>
                    <div className={styles["stake-button"]} onClick={handleWithdraw}>Withdraw</div>
                </div>      
            }

        </div>
    </Modal>
  )
}

export default ConfirmUnstake;