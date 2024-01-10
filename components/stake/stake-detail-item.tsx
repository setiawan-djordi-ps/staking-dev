import React, { MouseEventHandler, useState } from 'react'
import BuyShill from '../dialogs/buy-shill/buy-shill';
import ActionButton from '../shared/action-button';
import styles from "./stake-detail-item.module.scss";
import Image from 'next/image';


interface Props {
  style?: React.CSSProperties;
  shillStaked?: bigint | number;
  shillStakedDollars?: bigint | number;
  walletBalance?: bigint | number;
  locked?: boolean;
  finish?: boolean;
  started?: boolean;
  stakingStartsIn?: String;
  onStake?: MouseEventHandler;
  onUnstake?: MouseEventHandler;
}

function StakeDetailItem({ onStake, onUnstake, shillStaked, shillStakedDollars, walletBalance, locked, finish, started, stakingStartsIn }: Props) {
  
  const [showBuyShill, setShowBuyShill] = useState(false);
  
  const handleBuyShill = () => {
    setShowBuyShill(!showBuyShill);
  }

  const handleCloseBuyShill = () => {
    setShowBuyShill(!showBuyShill);
  }

  return (
    <div className={styles["stake-detail-container"]}>
      <div className={styles["stake-detail-content"]}>
        <div style={{width:"50%"}}>
          <div className={styles["stake-detail-title"]}>
            <Image alt="SHILL-Logo" src="/icon/shill-token-icon.svg" width={80} height={80} /> 
            <span className={styles["item-title"]}>Your Staking</span>
            
            <u className={styles["link"]} onClick={handleBuyShill}>Buy SHILL</u>
          </div>
        </div>
        <div style={{width:"50%"}}>
          <div className={styles["stake-detail-item"]}>
              <div>SHILL Staked</div>
              <p className={styles["stake-detail-field-title"]}>
                  <Image alt="SHILL-Logo" src="/icon/shill-token-icon.svg" width={20}  height={20}/> 
                  <span style={{marginLeft: 28}}>{shillStaked}</span>
              </p>
              {/* <div className={styles["shill-staked-amount"]}>&asymp; ${shillStakedDollars.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div> */}
          </div>
          { started ?
            <>
              <div className={styles["available-shill-parent"]}>
                <div>Available : {(walletBalance ?? 0).toLocaleString()} SHILL</div>
              </div>   
                <>   
                  { !finish &&
                    <div className={styles["stake-button"]} onClick={onStake}>
                        Stake Now
                    </div>
                  }
                  { finish && shillStaked > 0 &&
                    <div className={styles["stake-button"]} onClick={onUnstake}>
                        Withdraw Tokens
                    </div>
                  }
                  { !locked&& !finish &&
                    <u className={styles["unstake-link"]} onClick={onUnstake}>Unstake</u>
                  }
                </>
            </> 
            :
            <>
              <div className={styles["stakedisabled-button"]} >
                  Starting In {stakingStartsIn}
              </div>
            </>
          }    
      </div>
    </div>          

    <BuyShill show={showBuyShill} onClose={handleCloseBuyShill} />  
  </div>
  )
}

export default StakeDetailItem;