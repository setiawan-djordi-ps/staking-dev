import React, { MouseEvent } from 'react'
import styles from "./single-campaign-view.module.scss";
import SingleCampaign from './single-campaign';

export interface SingleStake {
  id: number;
  title: string;
  name: string;
  total_shill: Number | bigint;
  apy: Number;
  end: string;
  start: string;
  period: Number;
}



interface Props {
    campaigns: SingleStake[];
    onClick?: (event: MouseEvent<HTMLDivElement>, stake: SingleStake) => void;
    apy?: number;
}

function SingleCampaignView({ campaigns, onClick, apy}: Props) {
  return (
    <div className={styles["stake-campaign-parent"]}>
        {campaigns.map(campaign => <SingleCampaign key={campaign.name} stake={campaign} onClick={onClick} apy={apy} />)}
    </div>
  )
}

export default SingleCampaignView;