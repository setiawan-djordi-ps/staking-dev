import React, { MouseEvent, useEffect, useState } from 'react';
import BalanceInformations from './balance-informations';
import ConnectWallet from './connect-wallet';
import styles from './staking-dashboard.module.scss';
import { useAlert } from 'react-alert';
import { STEP } from '../constants';
import useAccountSol from '../hooks/useAccountSol';
import StakeCampaign, { Stake, StakeSol } from './campaign/stake-campaign';
import ToggleSwitch from './shared/toggle-switch';
import { useRouter } from 'next/dist/client/router';
import { WALLET_PARAMS } from '../pages';
import TabLayout from './shared/tab-layout';
import TabItem from './shared/tab-item';
import PromoCampaignView from './campaign/promo-campaign-view';
import SingleCampaignView, { SingleStake } from './campaign/single-campaign-view';
import { useAppContext } from '../context/state';
// import Modal, { ModalType } from './dialogs';
import Modal from './modal';
import StakeShill from './dialogs/confirm-stake/stake-shill';
import ConfirmStakeShill from './dialogs/confirm-stake/stake-shill';
//import axios
import axios from 'axios';
import ActionButton from './shared/button';
import CampaignTypeDialog from './dialogs/mobile/campaign-type';
import { useMediaQuery } from 'react-responsive';
import SearchInput from './search/search-input';
import { get } from 'http';


const StakingDashboardSol = () => {

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const router = useRouter();
    const alert = useAlert();


    const { web3Account, provider, setCampaign } = useAppContext();
    const { 
        currentStep,
        claiming,
        walletQuery,
        walletBalance,
        totalStakeds,
        shillPrice,
        totalRewards,
        totalRewardsPercent,
        totalStakedDolar,
        totalDistributedReward,
        getTotalStaked,
        getApy,
        getEnd,
        getEndTime,
        getPeriod,
        getLockPeriod,
        getTokenBalance,
        getStakerStatus,
        getUserStaked,
        fetchTotalValue
    } = useAccountSol();

    const [campaigns, setCampaigns] = useState<StakeSol[]>([]);

    const [inProgressCampaigns, setInProgressCampaigns] = useState<StakeSol[]>([]);
    const [yourStakesCampaigns, setYourStakesCampaigns] = useState<StakeSol[]>([]);
    const [comingSoonCampaigns, setComingSoonCampaigns] = useState<StakeSol[]>([]);
    const [completedCampaigns, setCompletedCampaigns] = useState<StakeSol[]>([]);
    const [totalStakedShill, setTotalStakedShill] = useState(0);

    async function fetchData() {
        const response = await axios.get('https://api.projectseed.com/v1/staking/sol');
        console.log("pool", response.data.data);
        const pool = response.data.data;
    
        const campaigns = [];
        const inProgressCampaigns = [];
        const completedCampaigns = [];
        const comingSoonCampaigns = [];
        let totalStakedShill = 0;
        let delay = 0; 
    
        for (const poolItem of pool) {
            setTimeout(async () => {
                const poolId = poolItem.id;
                const stakingTokenAddr = poolItem.stakingTokenAddr;
                const rewardTokenAddr = poolItem.rewardTokenAddr;
                const stakingTokenName = poolItem.stakingTokenName;
                const rewardTokenName = poolItem.rewardTokenName;
    
                const total_shill = await getTotalStaked(poolId, stakingTokenAddr, rewardTokenAddr);
                const apy = await getApy(poolId, stakingTokenAddr, rewardTokenAddr);
                const end = await getEnd(poolId, stakingTokenAddr, rewardTokenAddr);
                const endTime = await getEndTime(poolId, stakingTokenAddr, rewardTokenAddr);
                const period = await getPeriod(poolId, stakingTokenAddr, rewardTokenAddr);
                const lock = await getLockPeriod(poolId, stakingTokenAddr, rewardTokenAddr);
    
                const campaign = {
                    id: poolId,
                    title: "Staking Pool",
                    name: stakingTokenName,
                    rewardName: rewardTokenName,
                    total_shill,
                    apy,
                    end,
                    endTime,
                    completed: 0,
                    period,
                    lock,
                    rewardToken: rewardTokenAddr,
                    stakeToken: stakingTokenAddr
                };
    
                const startTime = poolItem.startTime;
                const currentTime = Math.floor(new Date().getTime()/1000); 
                const campaignEnd = campaign.endTime;
    
                const staker = await getStakerStatus(poolId, stakingTokenAddr);
                const totalStaked = await getTotalStaked(poolId, stakingTokenAddr, rewardTokenAddr);
    
                totalStakedShill += totalStaked;
    
                if (staker) {
                    const stakerStakedAmount = await getUserStaked(poolId, stakingTokenAddr);
                    if (stakerStakedAmount > 0) {
                        campaigns.push(campaign);
                    }
                }
    
                if (campaignEnd > currentTime && startTime < currentTime) {
                    inProgressCampaigns.push(campaign);
                } else if (campaignEnd < currentTime) {
                    campaign.completed = 1;
                    completedCampaigns.push(campaign);
                } else if (startTime > currentTime){
                    campaign.completed = 2; //coming soon
                    comingSoonCampaigns.push(campaign);
                }
    
                // Updating state or logging only after all async operations are complete
                console.log('completed campaigns', completedCampaigns);
                console.log('total staked shill', totalStakedShill);
                const totalStakedShillValue = parseFloat("0.00827438") * totalStakedShill;
                console.log('total staked shill value', totalStakedShillValue)
                if(!Number.isNaN(totalStakedShillValue)) {
                    setTotalStakedShill(totalStakedShillValue);
                }
                setInProgressCampaigns(inProgressCampaigns);
                setYourStakesCampaigns(campaigns);
                setCompletedCampaigns(completedCampaigns);
                setComingSoonCampaigns(comingSoonCampaigns);
            }, delay);
        }
        await fetchTotalValue();
    }
    
    useEffect(() => {
        if (provider) {
            fetchData();
            console.log('called');
        }
    }, [web3Account, provider]);


    const handleStakeClick = async (event: MouseEvent<HTMLDivElement>, campaign: StakeSol) => {
        console.log("Stake clicked SOLANA");
        try{
            const stakingTokenAddr = campaign.stakeToken;
            const rewardTokenAddr = campaign.rewardToken;
            const tokenBalance = await getTokenBalance(stakingTokenAddr);
            if(tokenBalance > -1){
                setCampaign(campaign)
                router.push(`/dashboard-sol/${campaign.id}?${walletQuery()}&stakingTokenAddr=${stakingTokenAddr}&rewardTokenAddr=${rewardTokenAddr}`);
            }
        }catch(err){
            
        }
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
                    totalStaked={totalStakeds}
                    totalStakedValue={totalStakedDolar}
                    totalRewards={totalDistributedReward}
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
                                        {/* <SearchInput value=""/> */}
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
                                            {/* <SearchInput value=""/> */}
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
                                            {/* <SearchInput value=""/> */}
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
                                            {/* <SearchInput value=""/> */}
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
export default StakingDashboardSol;
