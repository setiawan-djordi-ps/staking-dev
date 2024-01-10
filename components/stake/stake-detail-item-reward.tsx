import React, { MouseEventHandler } from 'react'
import TimeUtils from '../../utils/timeUtil';
import ActionButton from '../shared/action-button';
import styles from "./stake-detail-item-reward.module.scss";
import { useAppContext } from '../../context/state';

interface Props {
  style?: React.CSSProperties;
  shillEarned?: number | bigint;
  shillReward?: number | bigint;
  shillRewardDollars?: number | bigint;
  stakingEndsIn?: String;
  lockTime?: String;
  locked?: boolean;
  finish?: boolean;
  pending?: number | bigint;
  onClaimRewards?: MouseEventHandler;
}

function StakeDetailItemRewards({ onClaimRewards, shillEarned, shillReward, shillRewardDollars, stakingEndsIn, lockTime, locked , style, finish, pending}: Props) {
  const {  campaign } = useAppContext();


  return (
    <div className={styles["stake-detail-container"]} style={style}>
      <div className={styles["stake-detail-content"]}>
        <div style={{width:"50%"}}>
            <div className={styles["stake-detail-title"]}>
              
                <img alt="SHILL-Logo" src="/icon/shill-token-icon.svg" width={80} /> 
              
              {/* { campaign.rewardName == "O2" &&
                <img alt="o2-token-logo" src="/o2-token-logo.png" width={100} /> 
              } */}
              <span className={styles["item-title"]}>Your Rewards</span>
            </div>
        </div>
        <div style={{width:"50%"}}>
          <div className={styles["stake-detail-item"]}>
              <div>Next Rewards</div>
              <p className={styles["stake-detail-field-title"]}>
                  { campaign.rewardName == "SHILL" &&
                    <img alt="SHILL-Logo" src="/icon/shill-token-icon.svg" width={20} /> 
                  }
                  { campaign.rewardName == "O2" &&
                    <img alt="o2-token-logo" src="/o2-token-logo.png" width={20} /> 
                  }
                  <span style={{marginLeft: 28}}>{Number(shillReward).toLocaleString() }</span>
              </p>
              <div style={{textAlign: 'right', fontSize: 12}}>&asymp; ${shillRewardDollars.toLocaleString()}</div>
          </div>

          <div className={styles["stake-detail-item"]}>
              <div>User Pending</div>
              <p className={styles["stake-detail-field-title"]}>
                  { campaign.rewardName == "SHILL" &&
                    <img alt="SHILL-Logo" src="/icon/shill-token-icon.svg" width={20} /> 
                  }
                  { campaign.rewardName == "O2" &&
                    <img alt="o2-token-logo" src="/o2-token-logo.png" width={20} /> 
                  }
                  <span style={{marginLeft: 28}}>{Number(pending).toLocaleString() }</span>
              </p>
          </div>

          {/* <div className={styles["stake-detail-claimed-rewards"]}>
            <div>Claimed Rewards</div>
            <div>{Number(shillEarned).toLocaleString()} SHILL</div>
          </div>  */}

          {/* <ActionButton style={{margin: '16px 0px'}} onClick={onClaimRewards}>Claim Rewards</ActionButton> */}
          {
              !locked && shillReward > 0 && !finish &&  
              <div className={styles["stake-button"]} onClick={onClaimRewards}>
                  Claim Rewards
              </div>
          }

          { 
              locked && !finish &&
              <div className={styles["locked-button"]}>
                  Unlock In {lockTime}
              </div>
          }

          {
              finish && shillReward > 0 && 
              <div className={styles["locked-button"]}>
                  Withdraw to Claim
              </div>
          }
          {/* <div className={styles["rewards-claimable"]}>
            <div>Rewards claimable in:</div>
            <div>{TimeUtils.fromSecondsToDHMS(lockTime - Math.round(new Date().getTime()/1000))}</div>
          </div> */}
        </div>
      </div>        
    </div>
  )
}

export default StakeDetailItemRewards;