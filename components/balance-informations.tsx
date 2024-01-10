import React from "react";
import styles from "./balance-informations.module.scss";

const balanceInformations = ({ step, currentStep, account, balance, totalStaked, totalStakedValue, shillPrice, totalRewards, totalRewardsPercent}) => {
    return (
        <div className={styles["balance-informations-container"]}>
            <img src="/assets/coin-stack-and-star.svg" className={styles["coin-stack-image"]}/>
            <section className={styles["balance-informations-title"]}>
                <h1>Staking</h1>
            </section>
            <br/>
            {/* <div style={{marginTop: 32}} /> */}

            <div className={styles["balance-informations-item"]}>
                <label>Total Amount Staked</label>
                <p>${totalStakedValue?.toFixed(3)}</p>
            </div>
            <div className={styles["balance-informations-item"]}>
                <label>SHILL Price</label>
                <p>${shillPrice}</p>
            </div>
            <div className={styles["balance-informations-item"]}>
                <div style={{display:'flex',justifyContent:'space-between', margin:'0px'}}>
                    <label> Total Distributed Rewards </label>
                    {/* <label> XX.XX% </label> */}
                </div>
                <p>${totalRewards?.toFixed(3)}</p>
            </div>
        </div>
    );
};

export default balanceInformations;
