import { MouseEvent } from "react";
import TimeUtils from "../../utils/timeUtil";
import ActionButton from "../shared/action-button";
import CustomButton from "../shared/custom-button";
import styles from "./stake-campaign.module.scss";
import Image from 'next/image';

export interface Stake {
    id: any;
    title: any;
    name: any;
    rewardName: any;
    total_shill: any;
    apy: any;
    end: any;
    endTime: any;
    completed: any;
    period: any;
    lock: any;
    stakeToken: any;
    rewardToken: any;
}

export interface StakeSol {
    id: any;
    title: any;
    name: any;
    rewardName: any;
    total_shill: any;
    apy: any;
    end: any;
    endTime: any;
    completed: any;
    period: any;
    lock: any;
    stakeToken: any;
    rewardToken: any;
}

interface StakeCampaignProps {
    stake: any
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent<HTMLDivElement>, campaign: Stake) => void;
    apy?: number;
}

function StakeCampaign<StakeCampaignProps>({onClick, style = {}, stake, apy}) {
    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        onClick(event, stake);
    }

    return (
        <>
            <div className={styles["stake-campaign-pool-container"]} onClick={handleClick} style={style}>
                <div className={styles["stake-campaign-pool"]}>
                    <div className={styles["stake-campaign-pool-title"]}>
                        <div className={styles["logo-image"]}>
                            <img alt="SHILL-Logo" src="/icon/shill-token-icon.svg"/> 
                        </div>
                        <span className={styles["stake-name"]}>{stake.name}</span>  
                        <div className={styles["stake-campain-pool-status"]}>
                            {stake.completed == 1 && "COMPLETED" }
                            {stake.completed == 0 && "IN PROGRESS"}
                            {stake.completed == 2 && "COMING SOON"}
                        </div>
                    </div>
                    <div className={styles["stake-campaign-pool-subtitle"]}>
                        <span> Rewards Pool </span> &nbsp;
                        <div>
                            <b> {stake.rewardName} </b>
                        </div>
                    </div>
                    
                    <div className={styles["stake-campaign-pool-item"]} >
                        <div>SHILL is the GameFi Engine (currency) of the Project SEED Ecosystem, powering various activities from gaming to blockchain applications. The goals of SHILL include expanding its utility across various platforms and ecosystems, opening up the world of blockchain gaming to a broader audience.</div>
                    </div>
                </div>            
            </div>
            <div className={styles["stake-campaign-container"]} onClick={handleClick} style={style}>
                <div className={styles["stake-campaign-content"]}>
                    <div className={styles["stake-pool-info"]}>
                        <div className={styles["logo-image"]}>
                            <img alt="SHILL-Logo" src="/icon/shill-token-icon.svg"  /> 
                        </div>
                        <div className={styles["stake-text-container"]}>
                            <div className={styles["stake-pool-title"]}>
                                {stake.name} POOL
                            </div>
                            <div className={styles["stake-pool-subtitle"]}>
                                Stake {stake.name} get {stake.rewardName}
                            </div>
                        </div>
                    </div>
                    <div className={styles["stake-campaign-display-flex"]}> 
                        {/* <div>
                            <div className={styles["stake-campaign-footer-item"]}>
                                <label>APY:</label>
                                <div>{(stake.apy?.toLocaleString()) ?? "0"}%</div>
                            </div>                

                            <div className={styles["stake-campaign-footer-item"]}>
                                <label>Staking Period:</label>
                                <div>{Math.trunc(stake.period)} Days</div>
                            </div>          
                        </div>      */}
                        <div>
                            <div className={styles["stake-campaign-item"]}>
                                <label>Staking Period : {stake.period}</label>
                                
                            </div>

                        </div> 
                        <div>
                            <div className={styles["stake-campaign-item"]}>
                                <label>Locked Period : {stake.lock}</label>
                            </div>
                        </div> 
                    </div>
                    <div className={styles["stake-campaign-display-flex"]}> 
                        <div>
                            <div className={styles["stake-campaign-item"]}>
                                <label>APY</label>
                                <p className={styles["stake-campaign-field-title"]}>
                                    <img alt="SHILL-Logo" src="/icon/shill-token-icon.svg" width={20} height={20} /> 
                                    <span style={{marginLeft: 5}}>{(stake.apy ? stake.apy.toLocaleString(undefined, {maximumFractionDigits: 0}) : "0") + "%"}</span>
                                </p>
                            </div>

                        </div> 
                        <div>
                            <div className={styles["stake-campaign-item"]}>
                                <label>Total SHILL Staked</label>
                                <p className={styles["stake-campaign-field-title"]}>
                                    <img alt="SHILL-Logo" src="/icon/shill-token-icon.svg" width={20} height={20} /> 
                                    <span style={{marginLeft: 5}}>{(stake.total_shill?.toLocaleString()) ?? "0"}</span>
                                </p>
                            </div>

                        </div> 
                    </div>
                    {/* <ActionButton style={{margin: '16px 0px'}}>View</ActionButton> */}
                        <div className={styles["stake-pool-button"]}>
                            View
                        </div>
                </div>            
            </div>
        </>
    );
}

export default StakeCampaign;