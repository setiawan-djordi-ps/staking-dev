import React, { MouseEvent, useEffect, useState } from 'react';
import BalanceInformations from './balance-informations';
import ConnectWallet from './connect-wallet';
import styles from './staking-dashboard.module.scss';
import { useAlert } from 'react-alert';
import { STEP } from '../constants';
import useAccount from '../hooks/useAccount';
import StakeCampaign, { Stake } from './campaign/stake-campaign';
import ToggleSwitch from './shared/toggle-switch';
import { useRouter } from 'next/dist/client/router';
import { WALLET_PARAMS } from '../pages';
import TabLayout from './shared/tab-layout';
import TabItem from './shared/tab-item';
import PromoCampaignView from './campaign/promo-campaign-view';
import SingleCampaignView, { SingleStake } from './campaign/single-campaign-view';
import { useAppContext } from '../context/state';
import Modal from './modal';
import StakeShill from './dialogs/confirm-stake/stake-shill';
import ConfirmStakeShill from './dialogs/confirm-stake/stake-shill';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import ActionButton from './shared/button';
import SearchInput from './search/search-input';
import CampaignTypeDialog from './dialogs/mobile/campaign-type';

const StakingDashboard = () => {

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const router = useRouter();
    const alert = useAlert();

    const { web3Account, provider } = useAppContext();
    const { 
        currentStep,
        walletQuery,
        walletBalance,
        totalStaked,
        totalStakedValue,
        shillPrice,
        totalRewards,
        totalRewardsPercent,
        shillRewardDollars,
        getTotalStaked,
        getApy,
        getEnd,
        getEndTime,
        getPeriod,
        getLockPeriod,
        getStaked,
        getRewardDistributed
    } = useAccount();
    
    const [campaigns, setCampaigns] = useState<Stake[]>([]);

    const [totalStakedShill, setTotalStakedShill] = useState(0);
    const [totalStakedShillValue, setTotalStakedShillValue] = useState(0);
    const [totalRewardShillValue, setTotalRewardShillValue] = useState(0);

    const [yourStakesCampaigns, setYourStakesCampaigns] = useState<Stake[]>([]);
    const [inProgressCampaigns, setInProgressCampaigns] = useState<Stake[]>([]);
    const [comingSoonCampaigns, setComingSoonCampaigns] = useState<Stake[]>([]);
    const [completedCampaigns, setCompletedCampaigns] = useState<Stake[]>([]);

    async function fetchData() {
        //create axios function to get all data from this api endpoint localhost:3100/v1/staking/all
        const response = await axios.get('https://api.projectseed.com/v1/staking/all');
        console.log("pool",response.data.data);
        const pool = response.data.data;
        const campaigns: Stake[] = Array();
        const inProgressCampaigns: Stake[] = [];
        const completedCampaigns: Stake[] = [];
        const comingSoonCampaigns: Stake[] = [];
        
        for(let i = 0; i < pool.length; i++){
            const campaign: Stake = {
                id: pool[i].id,
                title: "Staking Pool",
                name: pool[i].stakingTokenName,
                rewardName: pool[i].rewardTokenName,
                rewardToken: pool[i].rewardTokenAddr,
                stakeToken: pool[i].stakingTokenAddr,
                total_shill: await getTotalStaked(pool[i].id),
                apy: await getApy(pool[i].id),
                end: await getEnd(pool[i].id),
                lock: await getLockPeriod(pool[i].id),
                endTime: await getEndTime(pool[i].id),
                period: await getPeriod(pool[i].id),
                completed: 0
            };

            const startTime = pool[i].startTime;
            const currentTime = Math.floor(new Date().getTime()/1000); // convert to seconds
            const campaignEnd = campaign.endTime;

            const totalShillStakedDollar = campaign.total_shill * parseFloat("0.00835611");
            const totalReward = await getRewardDistributed(pool[i].id);
            const totalRewardDollar = totalReward * parseFloat("0.00835611");

            setTotalStakedShillValue(totalShillStakedDollar);
            setTotalRewardShillValue(totalRewardDollar);
            console.log("campaign end time",campaignEnd)
            console.log("current time",currentTime)
            console.log("start time",startTime)

            const userStakingStaked = await getStaked(pool[i].id);
            if(userStakingStaked > 0){
                campaigns.push(campaign);
            }
            
            if (campaignEnd > currentTime && startTime < currentTime) {
                inProgressCampaigns.push(campaign);
            } else if (campaignEnd < currentTime) {
                campaign.completed = 1;
                completedCampaigns.push(campaign);
            } else if(startTime > currentTime){
                campaign.completed = 2; //coming soon
                comingSoonCampaigns.push(campaign); // if the campaign end time equals the current time
            }
        }

        setYourStakesCampaigns(campaigns);
        setInProgressCampaigns(inProgressCampaigns);
        setComingSoonCampaigns(comingSoonCampaigns);
        setCompletedCampaigns(completedCampaigns);
      }

    useEffect(() => {
          fetchData();
          console.log('called');
    }, [web3Account,provider]);


    const handleStakeClick = (event: MouseEvent<HTMLDivElement>, campaign: Stake | SingleStake) => {
        console.log("Stake clicked");
        router.push(`/dashboard/${campaign.id}?${walletQuery()}`);
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCampaign,setCurrentCampaign] = useState(0);
    const [campaignType , setCampaignType] = useState([
        {
            title:'In-Progress',
            info_message:'There are no active stakes at this moment.',
            message:'Staked assets are currently accruing rewards. Below is a list of available stakings and their progress.',
            campaign:[]
        },
        {
            title:'Your Stakes',
            info_message:'You have no active stake. Stake on any available pool and start earning rewards.',
            message:'This tab provides an overview of your in-progress and completed staking. View details of all your staking, rewards earned, and duration.',
            campaign:[]
        },
        {
            title:'Coming Soon',
            info_message:'Promising pools will be available to stake in the near future. Please check back for updates.',
            message:'Explore the available staking pool selection below. Stay updated for additional future staking options.',
            campaign:[]
        },
        {
            title:'Completed',
            info_message:'There are no completed stakes to display.',
            message:'Explore the available staking pool selection below. Stay updated for additional future staking options.',
            campaign:[]
        }
    ]);

    useEffect(() => {
        setCampaignType((prevCampaignType) => {
          const updatedCampaignType = [...prevCampaignType];
      
          updatedCampaignType[0].campaign = inProgressCampaigns;
          updatedCampaignType[1].campaign = yourStakesCampaigns;
          updatedCampaignType[2].campaign = comingSoonCampaigns;
          updatedCampaignType[3].campaign = completedCampaigns;
      
          return updatedCampaignType;
        });
      }, [inProgressCampaigns,comingSoonCampaigns,completedCampaigns,yourStakesCampaigns]);
    
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
            
    const handleCampaignType = (data) => {
         setCurrentCampaign(data);
         setIsModalOpen(false);
    }

    return (
        <div  className={styles['invest-dashboard-container']}>
            <div className={styles["staking-infomation-balance"]}>
                <BalanceInformations
                    step={STEP}
                    currentStep={currentStep}
                    account={web3Account}
                    balance={walletBalance?.toLocaleString()}
                    totalStaked={totalStaked}
                    totalStakedValue={totalStakedShillValue}
                    totalRewards={totalRewardShillValue}
                    totalRewardsPercent={totalRewardsPercent}
                    shillPrice={shillPrice}
                />
            </div>

          
            <div className={styles["stake-campaign-root"]}>
              
                {   
                        isMobile ? <>
                            <ActionButton onClick={()=> {openModal()}}>
                                {campaignType[currentCampaign].title}
                            </ActionButton>
                            <br/>   
                            <br/>
                            {
                                campaignType[currentCampaign].campaign.length === 0 ?
                                <div className={styles["staking-message-info"]}>
                                    {campaignType[currentCampaign].info_message}
                                </div> 
                                :
                                <>
                                    <div className={styles["search-container"]}>
                                        <SearchInput value="" />
                                    </div>
                                    <div className={styles["text-info"]}>
                                        <p>{campaignType[currentCampaign].message}</p>
                                    </div>
                                </>
                            }
                             <PromoCampaignView campaigns={campaignType[currentCampaign].campaign} onClick={handleStakeClick} /> 
                            </>
                        :
                        <TabLayout selected={0}>
                          
                            <TabItem key={1} title="In-Progress" className={styles["tab-item"]}>
                             {
                                    campaignType[0].campaign.length === 0 ?
                                        <div className={styles["staking-message-info"]}>
                                            {campaignType[0].info_message}
                                        </div> 
                                    :
                                    <>
                                        <div className={styles["search-container"]}>
                                            {/* <SearchInput value="" /> */}
                                        </div>
                                        <div className={styles["text-info"]}>
                                            <p>{campaignType[0].message}</p>
                                        </div>
                                    </>
                                }
                                <PromoCampaignView campaigns={inProgressCampaigns} onClick={handleStakeClick} />
                            </TabItem>
                            <TabItem key={2} title="Your Stakes" className={styles["tab-item"]}>
                            {
                                    campaignType[1].campaign.length === 0 ?
                                        <div className={styles["staking-message-info"]}>
                                            {campaignType[1].info_message}
                                        </div> 
                                    :
                                    <>
                                        <div className={styles["search-container"]}>
                                            {/* <SearchInput value="" /> */}
                                        </div>
                                        <div className={styles["text-info"]}>
                                            <p>{campaignType[1].message}</p>
                                        </div>
                                    </>
                                }
                                <PromoCampaignView campaigns={yourStakesCampaigns} onClick={handleStakeClick} />
                            </TabItem>
                            <TabItem key={3} title="Coming Soon" className={styles["tab-item"]}>
                                {
                                    campaignType[2].campaign.length === 0 ?
                                        <div className={styles["staking-message-info"]}>
                                            {campaignType[2].info_message}
                                        </div> 
                                    :
                                    <>
                                        <div className={styles["search-container"]}>
                                            {/* <SearchInput value="" /> */}
                                        </div>
                                        <div className={styles["text-info"]}>
                                            <p>{campaignType[2].message}</p>
                                        </div>
                                    </>
                                }
                                <PromoCampaignView campaigns={comingSoonCampaigns} onClick={handleStakeClick} />
                            </TabItem>
                            <TabItem key={4} title="Completed" className={styles["tab-item"]}>
                                {
                                    campaignType[3].campaign.length === 0 ?
                                        <div className={styles["staking-message-info"]}>
                                            {campaignType[3].info_message}
                                        </div> 
                                    :
                                    <>
                                        <div className={styles["search-container"]}>
                                            {/* <SearchInput value="" /> */}
                                        </div>
                                        <div className={styles["text-info"]}>
                                            <p>{campaignType[3].message}</p>
                                        </div>
                                    </>
                                }
                                <PromoCampaignView campaigns={completedCampaigns} onClick={handleStakeClick} />
                            </TabItem>
                        </TabLayout>
                }
            </div>
            <div>
                <img src="/assets/staking-shill.png" alt="staking shill" className={styles["staking-shill-images"]} draggable="false"/>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} noContentStyle>
                <CampaignTypeDialog listType={['In-Progress' , 'Your Stakes' , 'Coming Soon' , 'Completed' ]} currentCampaign={currentCampaign} onClickData={handleCampaignType}/>
            </Modal>
        </div>
    );
};
export default StakingDashboard;
