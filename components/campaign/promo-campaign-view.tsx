import React, { MouseEvent } from 'react'
import StakeCampaign, { Stake } from './stake-campaign';
import styles from "./promo-campaign-view.module.scss";

// export type Campaign = {
//     id: number,
//     title: string,
//     name: string,
//     total_shill: string,
//     apy: string,
//     end: string,
// }

interface Props {
    campaigns: any[];
    onClick?: (event: MouseEvent<HTMLDivElement>, stake: Stake) => void;
    apy?: number;
}

function PromoCampaignView({ campaigns, onClick}: Props) {
  
  return (
    <div className={styles["stake-campaign-parent"]}>
        {campaigns.map(campaign => <StakeCampaign key={campaign.id} stake={campaign} onClick={onClick} apy={campaign.apy} />)}
    </div>
  )
}

export default PromoCampaignView;