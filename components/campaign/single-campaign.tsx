import { MouseEvent } from "react";
import ActionButton from "../shared/action-button";
import CustomButton from "../shared/custom-button";
import { Stake } from "./stake-campaign";
import styles from "./stake-campaign.module.scss";

interface StakeCampaignProps {
    stake: Stake
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent<HTMLDivElement>, campaign: Stake) => void;
    apy?: number;
}

function SingleCampaign<StakeCampaignProps>({onClick, style = {}, stake, apy}) {
    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        onClick(event, stake);
    }

    return (
        <div className={styles["stake-campaign-container"]} onClick={handleClick} style={style}>
            <p className={styles["stake-campaign-tagname"]}>PROMO</p>
            <div className={styles["stake-campaign-content"]}>
                <div className={styles["stake-campaign-title"]}><img alt="SHILL-Logo" src="/SHILL_Logo.svg" width={20} /> <span style={{marginLeft: 8, fontSize: 18, fontWeight: 600}}>SHILL STAKING</span></div>
                <div className={styles["stake-campaign-subtitle"]}>Stake (Token) get (Token)</div>

                <div className={styles["stake-campaign-item"]}>
                    <div>Total SHILL Staked</div>
                    <p className={styles["stake-campaign-field-title"]}>
                        <img alt="SHILL-Logo" src="/SHILL_Logo.svg" width={20} /> 
                        <span >{stake.total_shill}</span>
                    </p>
                </div>

                <div className={styles["stake-campaign-item"]} >
                    <div>Starts in</div>
                    <p>{'XXX,XXX,XXX.XX'}</p>
                </div>

                <div className={styles["stake-campaign-footer-item"]}>
                    <div>APY:</div>
                    <div>{apy.toLocaleString()}%</div>
                </div>                

                <div className={styles["stake-campaign-footer-item"]}>
                    <div>Staking Period:</div>
                    <div>{stake.period} Days</div>
                </div>                

                <ActionButton style={{margin: '16px 0px'}}>Stake Now</ActionButton>
            </div>            
        </div>
    );
}

export default SingleCampaign;