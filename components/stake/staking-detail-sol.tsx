import React, { MouseEvent, useState, useEffect, useCallback } from "react";
import styles from "./staking-detail.module.scss";
import Image from 'next/image'
import StakeDetailItemSol from "./stake-detail-item-sol";
import StakeDetailItemRewards from "./stake-detail-item-reward";
import ConfirmStakeShill from "../dialogs/confirm-stake/stake-shill";
import StakeSuccess from "../dialogs/stake-success/stake-success";
import RewardsClaimed from "../dialogs/rewards-claimed/rewards-claimed";
import ConfirmUnstake from "../dialogs/confirm-unstake/confirm-unstake";
import AssertConfirmUnstake from "../dialogs/assert-unstake/assert-unstake";
import UnstakeSuccess from "../dialogs/unstake-success/unstake-success";
import useAccountSol from "../../hooks/useAccountSol";
import { useAppContext } from '../../context/state';
import { useAlert } from "react-alert";
import { sleep } from "../../utils/testUtil";
import ProgressDialog from "../shared/progress-dialog";
import { useRouter } from 'next/router'
import { AiOutlineLeft } from "react-icons/ai";
import { to } from "@react-spring/web";

const StakingDetailSol = (props) => {

    const { web3Account, provider, campaign } = useAppContext();

    const router = useRouter()
    const [queryParams, setQueryParams] = useState({ pool: '', stakingTokenAddr: '', rewardTokenAddr: '' });
    
    useEffect(() => {
        if (router.isReady) {
          const { pool , stakingTokenAddr, rewardTokenAddr } = router.query;
          console.log("query",router.query)
          console.log("stake campaign", campaign)
          if (typeof pool === 'string' && typeof stakingTokenAddr === 'string' && typeof rewardTokenAddr === 'string') {
            setQueryParams({ pool, stakingTokenAddr, rewardTokenAddr });
          } else {
            // Handle the case where the variables are not strings (e.g., show an error message)
          }
        }
    }, [router.isReady]);

    const [showConfirmShillDialog, setShowConfirmShillDialog] = useState(false);
    const [showStakeSuccessDialog, setShowStakeSuccessDialog] = useState(false);
    const [showRewardsClaimedDialog, setShowRewardsClaimedDialog] = useState(false);
    const [showUnstakeDialog, setShowUnstakeDialog] = useState(false);
    const [showAssertUnstake, setShowAssertUnstake] = useState(false);
    const [showAssertUnstakeSuccess, setShowAssertUnstakeSuccess] = useState(false);
    const [unstakeAmount, setUnstakeAmount] = useState('');
    const [progress, setProgress] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const {  
        shillStakedDollars,
        shillRewardDollars,
        stakeShill,
        initStaker,
        stakingBalance,
        claimRewards,
        getPeriod,
        getLockPeriod,
        getStakerStatus,
        getTokenBalance,
        lockTime,
        annualPercentageYield,
        totalStakeds,
        doStake,
        doClaim,
        doUnstake,
        getRewardEarned,
        getRewardClaimed,
        getTotalStaked,
        getUserStaked,
        getTotalReward,
        getRewardperDay,
        getApy,
        getEnd,
        getLocked,
        getLockedTime,
        getFinish,
        getStarted,
        getStart,
        fetchTotalValue
    } = useAccountSol();

    const alert = useAlert();

    const [apy,setApy] = useState(0);
    const [stakingPeriod,setStakingPeriod] = useState("");
    const [lockPeriod,setLockPeriod] = useState("");
    const [stakerExist, setStakerExist] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [rewardEarmed, setRewardEarned] = useState(0);
    const [rewardClaimed, setRewardClaimed] = useState(0);
    const [totalStaked, setTotalStaked] = useState(0);
    const [userStaked, setUserStaked] = useState(0);
    const [totalReward, setTotalReward] = useState(0);
    const [rewardPerDay, setRewardPerDay] = useState(0);
    const [stakingEndsIn, setStakingEndsIn] = useState("");
    const [lockEndsIn, setLockEndsIn] = useState("");
    const [stakingStartsIn, setStakingStartsIn] = useState("");
    const [locked, setLocked] = useState(false);
    const [finish, setFinish] = useState(false);
    const [started, setStarted] = useState(false);

    const getData = async () => {
        const [
          stakerExist,
          tokenBalance,
          totalStaked,
          totalReward,
          rewardPerDay,
          apy,
          stakingEndsIn,
          finish,
          period,
          lockPeriod,
          rewardEarned,
          rewardClaimed,
          userStaked,
          lockEndsIn,
          locked,
        ] = await Promise.all([
          getStakerStatus(queryParams.pool, queryParams.stakingTokenAddr),
          getTokenBalance(queryParams.stakingTokenAddr),
          getTotalStaked(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getTotalReward(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getRewardperDay(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getApy(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getEnd(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getFinish(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getPeriod(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getLockPeriod(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getRewardEarned(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getRewardClaimed(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getUserStaked(queryParams.pool, queryParams.stakingTokenAddr),
          getLockedTime(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getLocked(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
        ]);

        await fetchTotalValue();
    
        console.log('totalstaked', totalStaked);
    
        if (stakerExist) {
          setLocked(locked);
          setRewardEarned(rewardEarned);
          setRewardClaimed(rewardClaimed);
          setUserStaked(userStaked);
          setLockEndsIn(lockEndsIn);
        }
        
        setTotalStaked(totalStaked);
    
        setTokenBalance(tokenBalance);
        setLockPeriod(lockPeriod);
        setStakingPeriod(period);
        setStakerExist(stakerExist);
        setTotalReward(totalReward);
        setRewardPerDay(rewardPerDay);
        setApy(apy);
        setStakingEndsIn(stakingEndsIn);
        setFinish(finish);
      }
    
      const getCountdown = async () => {
        const [
          stakingEndsIn,
          started,
          stakingStartsIn,
          stakerExist,
          finish,
          lockEndsIn,
          locked,
        ] = await Promise.all([
          getEnd(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getStarted(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getStart(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getStakerStatus(
            queryParams.pool,
            queryParams.stakingTokenAddr
          ),
          getFinish(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getLockedTime(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
          getLocked(
            queryParams.pool,
            queryParams.stakingTokenAddr,
            queryParams.rewardTokenAddr
          ),
        ]);
    
        if (stakerExist) {
          setLocked(locked);
          setLockEndsIn(lockEndsIn);
        }
    
        setFinish(finish);
        setStarted(started);
        setStakingStartsIn(stakingStartsIn);
        setStakingEndsIn(stakingEndsIn);
      };
    
      useEffect(() => {
        console.log('query called', queryParams);
        if (queryParams && provider) {

            getData();
    
          const interval = setInterval(() => {
            getCountdown();
          }, 1000);

          const interval2 = setInterval(() => {
            getData();
          }, 5000);
    
          return () => {
            clearInterval(interval);
            clearInterval(interval2);
          };
        }
      }, [ queryParams,web3Account,provider]);
    

    const getTokenBalanceSingle = async () => {
        const tokenBalance = await getTokenBalance(queryParams.stakingTokenAddr);
        setTokenBalance(tokenBalance);
    }

    const getStakedBalanceSingle = async () => {
        const userStaked = await getUserStaked(queryParams.pool, queryParams.stakingTokenAddr);
        setUserStaked(userStaked);
    }

    const handleInit = async () => {
        setClaiming(true)
        try{
            await initStaker(queryParams.pool, queryParams.stakingTokenAddr);
            await sleep(10);
            await getData()
        }catch(err){
            console.log(err);
            setClaiming(false)
        }
        //await getData()
        setClaiming(false)
    }

    const handleStake = () => {
        setShowConfirmShillDialog(!showConfirmShillDialog);
    }

    const handleClaimRewards = async () => {
        setClaiming(true);
        try {
            await doClaim(queryParams.pool, queryParams.stakingTokenAddr, queryParams.rewardTokenAddr);
            // await sleep(10);
            await sleep(10);
            await getData();
            setShowRewardsClaimedDialog(!showRewardsClaimedDialog);
            
        } catch(err){
            console.log(err);
            alert.show("Failed to claim reward");

        }
        setClaiming(false);
    }

    const handleCloseConfirmShill = () => {
        setShowConfirmShillDialog(!showConfirmShillDialog);
    }    

    const handleCloseSuccessDialog = () => {
        setShowStakeSuccessDialog(!showStakeSuccessDialog);
    }

    const handleStakeShillConfirm = async (amount: number | bigint) => {
        setProgress(true);
        try {
            await doStake(amount, queryParams.pool, queryParams.stakingTokenAddr, queryParams.rewardTokenAddr);
            await sleep(10);
            await getData();
            setShowConfirmShillDialog(!showConfirmShillDialog);
            setShowStakeSuccessDialog(!showStakeSuccessDialog);
        } catch(err) {
            console.log(err);
            setShowConfirmShillDialog(!showConfirmShillDialog);
            alert.show("Failed to stake shill token");
            setProgress(false);
        }
        setProgress(false);
    }

    const handleCloseRewardsClaimedDialog = () => {
        setShowRewardsClaimedDialog(!showRewardsClaimedDialog);
    }

    const handleUnstake = (event: MouseEvent) => {
        setShowUnstakeDialog(!showUnstakeDialog);
    }

    const handleCloseUnstakeDialog = () => {
        setShowUnstakeDialog(!showUnstakeDialog);
    }

    const handleConfirmUnstakeShill = async() => {
      if(!finish){
        setShowUnstakeDialog(!showUnstakeDialog);
        setShowAssertUnstake(!showAssertUnstake);
      }else{
        setShowUnstakeDialog(!showUnstakeDialog);
        setClaiming(true);
        await handleAssertUnstake()
        setClaiming(false);
      }
    }

    const handleCloseAssertUnstake = () => {
        setShowAssertUnstake(!showAssertUnstake);
    }

    const handleAssertUnstake = async () => {
        setProgress(true);
        try {
            await doUnstake(unstakeAmount, queryParams.pool, queryParams.stakingTokenAddr, queryParams.rewardTokenAddr);
            await sleep(10);
            await getData();
            setShowAssertUnstake(false);
            setShowAssertUnstakeSuccess(true);
            
        } catch(err) {
            console.log(err);
            setShowAssertUnstake(false);
            alert.show("Failed to unstake Shill");
        }
        setProgress(false);
    }

    const handleCloseAssertUnstakeSuccess = () => {
        setShowAssertUnstakeSuccess(!showAssertUnstakeSuccess);
    }

    const backToStakingPools = () => {
        router.push(`/dashboard-sol/?wallet=${web3Account}`);
    }

    return (
        <div className={styles["staking-details-container"]}>
            <div className={styles["staking-details-header"]}>
                <div className={styles["staking-details-title-wrap"]}>
                    <div className={styles["shill-staking-title-root"]}>
                        <div onClick={backToStakingPools} className={styles["back-to-staking-pools"]}>
                            <AiOutlineLeft size={15}/>
                            <p>Back to Staking Pools</p>
                        </div>
                        <div className={styles["shill-staking-title-parent"]}>
                            <div className={styles["header-shill-logo"]}>
                                <Image src="/icon/shill-token-icon.svg" alt="SHILL" width={50} height={50} />
                            </div>
                            <div style={{display:'flex',flexDirection:'column'}}>
                                <div className={styles["shill-staking-title"]}>SHILL STAKING</div>
                                <div className={styles["shill-staking-subtitle"]}>Stake SHILL get SHILL</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles["shill-staking-header-stats-root"]}>
                        <div>
                            <div className={styles["shill-staking-header-stats-title"]}>Staking Token</div>
                            <div className={styles["shill-staking-header-stats-subtitle"]}>
                                <Image src="/icon/shill-token-icon.svg" alt="SHILL" width={16} height={16} />
                                &nbsp;  SHILL
                            </div>
                        </div>
                        <div className={styles["separator"]}/>
                        <div>
                            <div className={styles["shill-staking-header-stats-title"]}>APY</div>
                            <div className={styles["shill-staking-header-stats-subtitle"]}>{(apy?.toLocaleString()) ?? "0"}%</div>
                        </div>
                        <div className={styles["separator"]} />
                        <div>
                            <div  className={styles["shill-staking-header-stats-title"]}>Staking Period</div>
                            <div className={styles["shill-staking-header-stats-subtitle"]}>{stakingPeriod}</div>
                        </div>
                        <div className={styles["separator"]} />
                        <div>
                            <div  className={styles["shill-staking-header-stats-title"]}>Lock Period</div>
                            <div className={styles["shill-staking-header-stats-subtitle"]}>{lockPeriod}</div>
                            
                        </div>
                    </div>

                    <div className={styles["staking-details-item"]}>
                        <div>Time until staking ends</div>
                        <p>{stakingEndsIn}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={styles["content-root"]}>
                <div className={styles["content-parent"]}>

                    <div className={styles["amount-parent"]}>
                        <div className={styles["staking-details-item-content"]} style={{marginRight: 16}}>
                            <div>Total Rewards</div>
                            <p>
                                <Image src="/icon/shill-token-icon.svg" alt="shill logo" width={20} height={20} />
                                &nbsp;&nbsp;
                                {(totalReward?.toLocaleString()) ?? "0"}
                            </p>
                        </div>

                        <div className={styles["staking-details-item-content"]}>
                            <div>{`Today's Rewards`}</div>
                            <p>
                                <Image src="/icon/shill-token-icon.svg" alt="shill logo" width={20} height={20} />
                                &nbsp;&nbsp;
                                {(rewardPerDay?.toLocaleString()) ?? "0"}
                            </p>
                        </div>
                    </div>                    

                    <div className={styles["staking-details-item-content"]}>
                        <div>{`Total SHILL Staked`}</div>
                        <p className={styles["total-shill-staked"]}>
                            <Image src="/icon/shill-token-icon.svg" alt="SHILL" width={20} height={20} /> 
                            &nbsp;&nbsp;
                            {(totalStakeds?.toLocaleString()) ?? "0"}
                        </p>
                    </div>

                    <div className={styles["staking-details-item-content"]}>
                        <div>{`Total SHILL Staked in Pool`}</div>
                        <p>
                            <Image src="/icon/shill-token-icon.svg" alt="shill logo" width={20} height={20} />
                            &nbsp;&nbsp;
                            {(totalStaked?.toLocaleString()) ?? "0"}
                        </p>
                    </div>

                    <div className={styles["staking-details-item-mobile"]}>
                        <div>Time until staking ends</div>
                        <p>{stakingEndsIn}</p>
                    </div>
                </div>

                <div className={styles["action-btn-parent"]}>
                    <StakeDetailItemSol onInit={handleInit} onStake={handleStake} onUnstake={handleUnstake} shillStaked={userStaked} shillStakedDollars={shillStakedDollars} walletBalance={tokenBalance} stakerExists={stakerExist} locked={locked} finish={finish} started={started} stakingStartsIn={stakingStartsIn}/>

                    { stakerExist && 
                        <StakeDetailItemRewards onClaimRewards={handleClaimRewards} shillEarned={rewardClaimed} shillReward={rewardEarmed} shillRewardDollars={shillRewardDollars} stakingEndsIn={stakingEndsIn} lockTime={lockEndsIn} locked={locked} finish={finish}/>
                    }
                    
                </div>
              
            </div>

            <ConfirmStakeShill walletBalance={tokenBalance} show={showConfirmShillDialog} onClose={handleCloseConfirmShill} onStake={handleStakeShillConfirm} stakePeriodRemaining={stakingEndsIn} progress={progress} shillStaked={userStaked} />
            <StakeSuccess show={showStakeSuccessDialog} onClose={handleCloseSuccessDialog} />
            <RewardsClaimed show={showRewardsClaimedDialog} onClose={handleCloseRewardsClaimedDialog} />
            <ConfirmUnstake show={showUnstakeDialog} onClose={handleCloseUnstakeDialog} onUnstake={handleConfirmUnstakeShill} stakePeriodRemaining={stakingEndsIn} progress={progress} stakingBalance={userStaked} setUnstakeAmount={setUnstakeAmount} finish={finish} />
            <AssertConfirmUnstake show={showAssertUnstake} onClose={handleCloseAssertUnstake} onConfirmUnstake={handleAssertUnstake} stakePeriodRemaining={stakingEndsIn} progress={progress} unstakeAmount={unstakeAmount} />
            <UnstakeSuccess show={showAssertUnstakeSuccess} onClose={handleCloseAssertUnstakeSuccess} />
            <ProgressDialog show={claiming} />
        </div>
    );
};

export default StakingDetailSol;
