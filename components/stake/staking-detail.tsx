import React, { MouseEvent, useState, useEffect } from "react";
import styles from "./staking-detail.module.scss";
import Image from 'next/image'
import StakeDetailItem from "./stake-detail-item";
import StakeDetailItemRewards from "./stake-detail-item-reward";
import ConfirmStakeShill from "../dialogs/confirm-stake/stake-shill";
import StakeSuccess from "../dialogs/stake-success/stake-success";
import RewardsClaimed from "../dialogs/rewards-claimed/rewards-claimed";
import ConfirmUnstake from "../dialogs/confirm-unstake/confirm-unstake";
import AssertConfirmUnstake from "../dialogs/assert-unstake/assert-unstake";
import UnstakeSuccess from "../dialogs/unstake-success/unstake-success";
import useAccount from "../../hooks/useAccount";
import { useAlert } from "react-alert";
import { sleep } from "../../utils/testUtil";
import ProgressDialog from "../shared/progress-dialog";
import { useRouter } from 'next/router'
import { AiOutlineLeft } from "react-icons/ai";
import { useAppContext } from "../../context/state";
import { Provider } from "@ethersproject/providers";
import { providers } from "web3modal";

const StakingDetail = (props) => {

    const router = useRouter()
    const { pool } = router.query
    const { web3Account,provider } = useAppContext();

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
        walletBalance, 
        staked, 
        shillStakedDollars,
        shillEarned,
        shillReward,
        shillRewardDollars,
        stakeShill,
        stakingBalance,
        unstakeShill,
        claimRewards,

        getApy,
        getEnd,
        getPeriod,
        getLockPeriod,
        getTotalStaked,
        getStaked,
        getEarned,
        getTotalReward,
        getRewardDaily,
        getStarted,
        getFinish,
        getLocked,
        getStakingEndsIn,
        getStakingStartsIn,
        getUserLockEndsIn,
        getUserPending
    } = useAccount();

    const alert = useAlert();

    const [apy,setApy] = useState(0);
    const [stakingPeriod,setStakingPeriod] = useState("");
    //create total staked const
    const [totalStaked,setTotalStaked] = useState(0);
    const [userStake,setUserStake] = useState(0);
    const [userEarned,setUserEarned] = useState(0);

    const [userPending,setUserPending] = useState(0);

    const [stakingEndsIn, setStakingEndsIn] = useState("");
    
    const [totalRewards, setTotalRewards] = useState(0);
    const [todaysReward, setTodaysReward] = useState(0);
    //create useEffect to get apy
    const [lockEndsIn, setLockEndsIn] = useState("");
    const [stakingStartsIn, setStakingStartsIn] = useState("");
    const [locked, setLocked] = useState(false);
    const [lockPeriod, setLockPeriod] = useState("");
    const [finish, setFinish] = useState(false);
    const [started, setStarted] = useState(false);
    
    useEffect(() => {
        const getReward = async () => {
            const fetchData = async () => {
                const [
                    earned,
                    endIns,
                    stakingStartsIn,
                    started,
                    finish,
                    locked,
                    lockEndsIn,
                    userPendings
                ] = await Promise.all([
                    getEarned(pool),
                    getEnd(pool),
                    getStakingStartsIn(pool),
                    getStarted(pool),
                    getFinish(pool),
                    getLocked(pool),
                    getUserLockEndsIn(pool),
                    getUserPending()
                ]);
    
                console.log("started", started);
                console.log("finish", finish);
                console.log("locked", locked);
                console.log("pending", userPendings)
    
                setUserEarned(earned);
                setStakingEndsIn(endIns)
                setStakingStartsIn(stakingStartsIn);
                setLockEndsIn(lockEndsIn);
                setStarted(started);
                setFinish(finish);
                setLocked(locked);
                setUserPending(userPendings);
            };
    
            fetchData();
        };
    
        getData();
    
        // This will call getData() once immediately and then every 2 seconds.
        const intervalId = setInterval(getReward, 1000);
    
        // Clear the interval when the component unmounts.
        return () => clearInterval(intervalId);
    }, [provider]);

    const getData = async () => {
        const fetchData = async () => {
            const [
                apy,
                period,
                lockPeriod,
                totalStaked,
                staked,
                earned,
                endIns,
                totalReward,
                dailyReward
            ] = await Promise.all([
                getApy(pool),
                getPeriod(pool),
                getLockPeriod(pool),
                getTotalStaked(pool),
                getStaked(pool),
                getEarned(pool),
                getEnd(pool),
                getTotalReward(pool),
                getRewardDaily(pool)
            ]);
    
            setApy(apy);
            setStakingPeriod(period);
            setTotalStaked(totalStaked);
            setUserEarned(earned);
            setUserStake(staked);
            setStakingEndsIn(endIns);
            setTotalRewards(totalReward);
            setTodaysReward(dailyReward);
            setLockPeriod(lockPeriod);
        };
    
        fetchData();
    };


    const fetchStakingData = async () => { 
        const apy = await getApy(pool);
        const totalStaked = await getTotalStaked(pool);
        const staked = await getStaked(pool);

        setApy(apy);
        setTotalStaked(totalStaked);
        setUserStake(staked);
    };

    const handleStake = () => {
        setShowConfirmShillDialog(!showConfirmShillDialog);
    }

    const handleClaimRewards = async () => {
        setClaiming(true);
        try {
            await claimRewards(pool);
            await getData();
            // await sleep(10);
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
            await stakeShill(amount, pool);
            await fetchStakingData();
            await getData();
            setShowConfirmShillDialog(!showConfirmShillDialog);
            setShowStakeSuccessDialog(!showStakeSuccessDialog);
            
        } catch(err) {
            console.log(err);
            setShowConfirmShillDialog(!showConfirmShillDialog);
            alert.show("Failed to stake shill token");
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

    const handleConfirmUnstakeShill = async () => {
        if(!finish){
            setShowUnstakeDialog(!showUnstakeDialog);
            setShowAssertUnstake(!showAssertUnstake);
        }else{
            setShowUnstakeDialog(false);
            setProgress(true);
            await handleAssertUnstake()
            setProgress(false);
        }
    }

    const handleCloseAssertUnstake = () => {
        setShowAssertUnstake(!showAssertUnstake);
    }

    const handleAssertUnstake = async () => {
        setProgress(true);
        try {
            await unstakeShill(unstakeAmount, pool);
            await fetchStakingData();
            await getData();
            setShowAssertUnstake(false);
            setShowAssertUnstakeSuccess(!showAssertUnstakeSuccess);
            
        } catch(err) {
            console.log(err);
            setShowUnstakeDialog(false)
            setShowAssertUnstake(false);
            alert.show("Failed to unstake Shill");
        }
        setProgress(false);
    }

    const handleCloseAssertUnstakeSuccess = () => {
        setShowAssertUnstakeSuccess(!showAssertUnstakeSuccess);
    }

    const backToStakingPools = () => {
        router.push(`/dashboard/?wallet=${web3Account}`);
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
                                &nbsp; 
                                SHILL
                            </div>
                        </div>
                        <div className={styles["separator"]}/>
                        <div>
                            <div className={styles["shill-staking-header-stats-title"]}>APY</div>
                            <div className={styles["shill-staking-header-stats-subtitle"]}>{(apy ? apy.toLocaleString(undefined, {maximumFractionDigits: 0}) : "0") + "%"}</div>
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
                        <label>Time until staking ends</label>
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
                                {(totalRewards?.toLocaleString()) ?? "0"}
                            </p>
                        </div>

                        <div className={styles["staking-details-item-content"]}>
                            <div>{`Today's Rewards`}</div>
                            <p>
                                <Image src="/icon/shill-token-icon.svg" alt="shill logo" width={20} height={20} />
                                &nbsp;&nbsp;
                                {(todaysReward?.toLocaleString()) ?? "0"}
                            </p>
                        </div>
                    </div>   


                    <div className={styles["staking-details-item-content"]}>
                        <div>{`Total SHILL Staked`}</div>
                        <p className={styles["total-shill-staked"]}>
                            <Image src="/icon/shill-token-icon.svg" alt="SHILL" width={20} height={20} /> 
                            &nbsp;&nbsp;
                            {(totalStaked?.toLocaleString()) ?? "0"}
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
                </div>

                <div className={styles["action-btn-parent"]}>
                    <StakeDetailItem onStake={handleStake} onUnstake={handleUnstake} shillStaked={userStake} shillStakedDollars={shillStakedDollars} walletBalance={walletBalance} locked={locked} finish={finish} started={started} stakingStartsIn={stakingStartsIn}/>
                    <StakeDetailItemRewards onClaimRewards={handleClaimRewards} shillEarned={userEarned} shillReward={userEarned} shillRewardDollars={shillRewardDollars} stakingEndsIn={stakingEndsIn} lockTime={lockEndsIn} locked={locked} finish={finish} pending={userPending}/>
                </div>
            </div>

            <ConfirmStakeShill walletBalance={walletBalance} show={showConfirmShillDialog} onClose={handleCloseConfirmShill} onStake={handleStakeShillConfirm} stakePeriodRemaining={stakingEndsIn} progress={progress} shillStaked={userStake}/>
            <StakeSuccess show={showStakeSuccessDialog} onClose={handleCloseSuccessDialog} />
            <RewardsClaimed show={showRewardsClaimedDialog} onClose={handleCloseRewardsClaimedDialog} />
            <ConfirmUnstake show={showUnstakeDialog} onClose={handleCloseUnstakeDialog} onUnstake={handleConfirmUnstakeShill} stakePeriodRemaining={stakingEndsIn} progress={progress} stakingBalance={userStake} setUnstakeAmount={setUnstakeAmount} finish={finish} />
            <AssertConfirmUnstake show={showAssertUnstake} onClose={handleCloseAssertUnstake} onConfirmUnstake={handleAssertUnstake} stakePeriodRemaining={stakingEndsIn} progress={progress} unstakeAmount={unstakeAmount} />
            <UnstakeSuccess show={showAssertUnstakeSuccess} onClose={handleCloseAssertUnstakeSuccess} />
            <ProgressDialog show={claiming} />
        </div>
    );
};

export default StakingDetail;
