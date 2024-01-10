import { useCallback, useEffect, useRef, useState } from 'react';
import getWeb3Provider from '../getWeb3';
import { useAppContext } from '../context/state';
import { useRouter } from 'next/dist/client/router';
import STAKING_ABI from '../abis/staking_abi.json';
import SHILL_ABI from '../abis/shill/Shill.json';
import Config from '../constants/config';
import TimeUtils from '../utils/timeUtil';
import { sleep } from '../utils/testUtil';
import Web3 from 'web3';
import axios from 'axios';

function useAccount() {

    const { web3Account, setWeb3Account, currentStep, setCurrentStep, provider, setProvider, web3SolAccount } = useAppContext();
    const [vestingContract, setVestingContract] = useState(null);
    const [shillAllotment, setShillAllotment] = useState(0);
    const [amountToClaim, setAmountToClaim] = useState(0);
    const [claimedToken, setClaimedToken] = useState(0);
    const [progress, setProgress] = useState(0);
    const [end, setEnd] = useState(new Date().toLocaleDateString('en-US'));    
    const [loading, setLoading] = useState(true);
    const refreshTimeoutRef = useRef<NodeJS.Timer>(null);
    const [claiming, setClaiming] = useState(false);
    const [walletBalance, setWalletBalance] = useState<bigint | number>(0);
    const [totalStaked, setTotalStaked] = useState<bigint | number>(0);
    const [totalStakedValue, setTotalStakedValue] = useState<bigint | number>(0);
    const [shillPrice, setShillPrice] = useState<bigint | number>(0);
    const [totalRewards, setTotalRewards] = useState<bigint | number>(0);
    const [totalRewardsPercent, setTotalRewardsPercent] = useState<bigint | number>(0);
    const [totalStakedRatio, setTotalStakedRatio] = useState<Number>(0);
    const [promoEndsIn, setPromoEndsIn] = useState(0);
    const [stakingPeriod, setStakingPeriod] = useState(365);
    const [stakingEndsIn, setStakingEndsIn] = useState<string>("");
    const [stakingDuration, setStakingDuration] = useState<Number>(); //In days
    const [todaysReward, setTodaysReward] = useState<bigint | number>(0);
    const [staked, setStaked] = useState<bigint | number>(0);
    const [shillStakedDollars, setShillStakedDollars] = useState(0);
    const [shillEarned, setShillEarned] = useState(0);
    const [shillReward, setShillReward] = useState(0);
    const [shillRewardDollars, setShillRewardDollars] = useState(0);
    const [stakingInProgress, setStakingInProgress] = useState(false);
    const [stakingBalance, setStakingBalance] = useState(0);
    const [lockTime, setLockTime] = useState(0);
    const [annualPercentageYield, setAnnualPercentageYield] = useState(0);
    const [totalShillStaked, setTotalShillStaked] = useState(0);
    const INTEREST_RATE = 1.11;

    const router = useRouter();
    const WALLET_PARAMS = "wallet";

    useEffect(() => {
        
        async function reconnectWallet() {
            console.log('provider', provider)
            if(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")){
                const provider: any = await getWeb3Provider();
                setProvider(provider);
            }
        }

        if(!provider){
            console.log("calked")
            reconnectWallet();  
        }
    })

    useEffect(() => {

        async function fetchBalance () {
            // async function reconnectWallet() {
            //     console.log('provider', provider)
            //     if(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")){
            //         const provider: any = await getWeb3Provider();
            //         setProvider(provider);
            //     }
            // }
            
            // reconnectWallet();
            if (!provider) return;
            try{
                const web3: any = new Web3(provider);
                const contract = new web3.eth.Contract(SHILL_ABI, Config.SHILL_ADDRESS);
                console.log("Wallet account: "+web3Account);
                const contractBalanceWei = await contract.methods.balanceOf(web3Account).call();
                const contractBalance = web3.utils.fromWei(contractBalanceWei, 'ether');
                console.log("Contract balance: "+contractBalance);
                setWalletBalance(Math.trunc(contractBalance));
            }catch(err){

            }
        }


        async function fetchShillPrice() {
            console.log("Fetching shill price");
            const url = 'https://api.projectseed.com/v1/currency/prices';
            fetch(url).then(result => result.json()).then(exchange => {
                console.log("exchange",exchange);
                let prices = exchange.data[0].price;
                console.log("prices",prices)
                setShillPrice(prices); 
                fetchTotalValue();
            }).catch(err => console.log(err));
        }
        
        let stakingEndsTimer: NodeJS.Timer;
        async function updateStakingEndTime(){
            console.log("Staking current time: "+new Date().getTime());
            console.log("Staking future time: "+promoEndsIn);
            stakingEndsTimer = setInterval(() => {
                const timeRemainingSeconds = (promoEndsIn - new Date().getTime()/1000);
                setStakingEndsIn(TimeUtils.fromSecondsToDHMS(timeRemainingSeconds));
            }, 1000);
            
        }

        async function fetchTotalValue() {
            console.log("Fetching total value");
            if (!web3Account) return;

            if(!provider) return;

            const response = await axios.get('https://api.projectseed.com/v1/staking/sol');
            console.log("pool",response.data.data);
            const pool = response.data.data;
            let totalValue = 0;
            let totalRewardValue = 0;
            for(let i = 0; i < pool.length; i++){
                const poolid = pool[i].id;
                const staked = await getTotalStaked(poolid);
                const reward = await getRewardDistributed(poolid);
                const shillPriceNumber = parseFloat("0.0101057");
                totalValue = totalValue + staked * shillPriceNumber;
                totalRewardValue = totalRewardValue + reward * shillPriceNumber;
            }
            setShillRewardDollars(totalValue);

        }

        
        
        fetchBalance();
        fetchShillPrice();
    }, [web3Account, provider]);

    const stakeShill = async (amount: number | bigint, pid: string | string[]) => {
        if (!provider) return;
        setStakingInProgress(true);
        const web3: any = new Web3(provider);
        const stakingContract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
        const shillContract = new web3.eth.Contract(SHILL_ABI, Config.SHILL_ADDRESS);
        console.log("Staking shill, contract account: "+web3Account);
        const amountWei = web3.utils.toWei(String(amount), 'ether');
        const allowanceWei = await shillContract.methods.allowance(web3Account, Config.STAKING_ADDRESS).call();
        console.log("allowance",allowanceWei)
        
        if (BigInt(allowanceWei) < BigInt(amountWei)) {
            const MAX_UINT256 = web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1));
            //allowance really big number

            await shillContract.methods.approve(Config.STAKING_ADDRESS, MAX_UINT256.toString()).send({ from: web3Account});
            console.log("Shill approved ");
        }
        await stakingContract.methods.stake(amountWei, pid).send({ from: web3Account});
        console.log("Shill staked");
        // await sleep(5);
        setStakingInProgress(false);
    }

    const unstakeShill = async (amount: string, pid: string | string[]) => {
        if (!provider) return;
        setStakingInProgress(true);
        const web3: any = new Web3(provider);
        const stakingContract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
        const shillContract = new web3.eth.Contract(SHILL_ABI, Config.SHILL_ADDRESS);
        console.log("Unstaking shill, contract account: "+web3Account);
        const amountWei = web3.utils.toWei(amount, 'ether');
        console.log("Unstake amount converted");
        // await shillContract.methods.approve(Config.STAKING_ADDRESS, amountWei).send({ from: web3Account });
        // console.log("Shill contract approve");
        await stakingContract.methods.unstake(amountWei, pid).send({ from: web3Account});
        console.log("Shill unstaked");
        // await sleep(5);
        setStakingInProgress(false);        
    }

    const claimRewards = async (pid: string | string[]) => {
        if (!provider) return;
        setStakingInProgress(true);
        const web3: any = new Web3(provider);
        const stakingContract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
        console.log("Claim amount converted");
        await stakingContract.methods.claimRewards(pid).send({ from: web3Account});
        console.log("Shill claimed");
        setStakingInProgress(false);        
    }

    const getTotalStaked = async (pid: any) => {
        if (!provider) return 0;
        try{
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);

            //Total shill staked
            const totalStakedWei = await contract.methods.getPoolInfo(pid).call();
            const totalStaked = web3.utils.fromWei(totalStakedWei[7], 'ether');
            return totalStaked * 1
        }catch(err){
            return 0
        }
    }

    const getStaked = async (pid: any) => {
        if (!provider ) return 0;
        try{
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);

            const stakedAmountWei = await contract.methods.getStaked(web3Account, pid).call();
            const stakedAmount = web3.utils.fromWei(stakedAmountWei, 'ether');
            console.log("Staked amount: "+stakedAmount);
            setStaked(stakedAmount);
            return stakedAmount
        }catch(err){
            return 0
        }
    }

    const getRewardDistributed = async (pid: any) => {
        if (!provider ) return 0;
        try{
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);

            const rewardDistributedWei = await contract.methods.getPoolInfo( pid).call();
            const rewardDistributed = web3.utils.fromWei(rewardDistributedWei[9], 'ether');
            
            return rewardDistributed;
        }catch(err){
            return 0
        }
    }

    const getEarned = async (pid: any) => {
        if (!provider ) return 0;
        try{
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            console.log("Web3 account: "+web3Account);
            console.log("Pid: "+pid)
            const shillEarnedWei = await contract.methods.earned(web3Account, pid).call();
            const shillEarned = web3.utils.fromWei(shillEarnedWei, 'ether');
            console.log("Shill earned: "+shillEarned);
            setShillEarned(shillEarned);
            // setShillReward(shillEarned)
            // setShillRewardDollars(shillEarned * Number(shillPrice))
            // setTotalStakedValue(totalStaked * Number(shillPrice))
            return shillEarned
        }catch(err){
            return 0
        }
    }

    const getApy = async (pid: any) => {
        if (!provider ) return 0;
        try{
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            
            const totalStakedWei = await contract.methods.getTotalStaked(pid).call();
            const totalStaked = web3.utils.fromWei(totalStakedWei, 'ether');
            //
            const rewardAmountWei = await contract.methods.getPoolInfo(pid).call();
            let totalRewards = web3.utils.fromWei(rewardAmountWei[2], 'ether');
            totalRewards = totalRewards;
            let stakingperiod = rewardAmountWei[5] / 86400;

            //Total shill staked ratio
            const annualPercentageYield = totalRewards / totalStaked * (365 / stakingperiod) * 100;

            return annualPercentageYield

            //APY = (total rewards / total staked) * (365 / days staked) * 100
        }catch(err){
            return 0
        }
    }

    const getEnd = async (pid: any) => {
        if (!provider ) return;
        try{
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            
            const promoEndsIn = await contract.methods.getPoolInfo(pid).call();

            console.log("time end",promoEndsIn)

            let timeDiff = promoEndsIn[4] - new Date().getTime()/1000;

            if(timeDiff < 0){
                return TimeUtils.fromSecondsToDHMS(0);
            }
            
            return TimeUtils.fromSecondsToDHMS(timeDiff);

            //APY = (total rewards / total staked) * (365 / days staked) * 100
        }catch(err){

        }
    }

    const getEndTime = async (pid: any) => {
        if (!provider ) return;
        try{
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            
            const promoEndsIn = await contract.methods.getPoolInfo(pid).call();

            console.log("end",promoEndsIn)
            
            return promoEndsIn[4];

            //APY = (total rewards / total staked) * (365 / days staked) * 100
        }catch(err){

        }
    }

    const getTotalReward = async (pid: any) => {
        if (!provider ) return;
        try{
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            
            const totalReward = await contract.methods.getPoolInfo(pid).call();

            const totalRewardInWei = web3.utils.fromWei(totalReward[2], 'ether');
            
            return totalRewardInWei * 1;

            //APY = (total rewards / total staked) * (365 / days staked) * 100
        }catch(err){

        }
    }

    const getRewardDaily = async (pid: any) => {
        if (!provider ) return;
        try{
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            
            const totalRewardPerSecond = await contract.methods.getPoolInfo(pid).call();

            const totalRewardPerSecondInWei = web3.utils.fromWei(totalRewardPerSecond[8], 'ether');
            
            return totalRewardPerSecondInWei * 86400 ;

            //APY = (total rewards / total staked) * (365 / days staked) * 100
        }catch(err){

        }
    }

    const getStarted = async (pid: any) => {
        if (!provider ) return;
        try {
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            const poolInfo = await contract.methods.getPoolInfo(pid).call();
            const startTime = poolInfo[3]
            return startTime <= new Date().getTime() / 1000 ? true : false;
        } catch (err) {
            // handle error
        }
    }

    const getFinish = async (pid: any) => {
        if (!provider ) return;
        try {
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            const poolInfo = await contract.methods.getPoolInfo(pid).call();
            const finishTime = poolInfo[4];
            return finishTime > new Date().getTime() / 1000 ? false : true;
        } catch (err) {
            // handle error
        }
    }

    const getLocked = async (pid: any) => {
        if (!provider ) return;
        try {
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            const userInfo = await contract.methods.getStakeholderInfo(web3Account,pid).call();
            console.log("user info",userInfo)
            const lockTime = userInfo[6];
            console.log("lock",lockTime)
            return lockTime > new Date().getTime() / 1000 ? true : false;
        } catch (err) {
            // handle error
            console.log(err)
        }
    }

    const getUserLockEndsIn = async (pid: any) => {
        if (!provider ) return;
        try {
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            const userInfo = await contract.methods.getStakeholderInfo(web3Account,pid).call();
            const poolInfo = await contract.methods.getPoolInfo(pid).call();
            const finishTime = poolInfo[4];
            let lockTime = userInfo[6];
            if(finishTime < lockTime){
                lockTime = finishTime;
            }
            const timeDiff = lockTime - new Date().getTime() / 1000;
            return timeDiff > 0 ? TimeUtils.fromSecondsToDHMS(timeDiff) : TimeUtils.fromSecondsToDHMS(0);
        } catch (err) {
            // handle error
            console.log(err)
        }
    }

    const getStakingStartsIn = async (pid: any) => {
        if (!provider ) return;
        try {
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            const poolInfo = await contract.methods.getPoolInfo(pid).call();
            const startTime = poolInfo[3];
            const timeDiff = startTime - new Date().getTime() / 1000;
            return timeDiff > 0 ? TimeUtils.fromSecondsToDHMS(timeDiff) : TimeUtils.fromSecondsToDHMS(0);
        } catch (err) {
            // handle error
        }
    }

    const getStakingEndsIn = async (pid: any) => {
        if (!provider ) return;
        try {
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            const poolInfo = await contract.methods.getPoolInfo(pid).call();
            const finishTime = poolInfo[4];
            const timeDiff = finishTime - new Date().getTime() / 1000;
            return timeDiff > 0 ? TimeUtils.fromSecondsToDHMS(timeDiff) : TimeUtils.fromSecondsToDHMS(0);
        } catch (err) {
            // handle error
        }
    }

    const getUserPending = async () => {
        if (!provider ) return;
        try {
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            const poolInfo = await contract.methods.pendingTransfers(web3Account).call();
            const pendingAmountWei = poolInfo[0];
            const pendingAmountEther = web3.utils.fromWei(pendingAmountWei, 'ether');
            return pendingAmountEther;
        } catch (err) {
            // handle error
        }
    }

    const getPeriod = async (pid: any) => {
        if (!provider ) return;
        try{
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            
            let duration = await contract.methods.getPoolInfo(pid).call();
            duration = duration[5] ;

            if(duration >= 86400){
                const durationInDays = duration / 86400;
                return durationInDays+" Days";
            }

            if(duration >= 3600){
                const durationInHours = duration / 3600;
                return durationInHours+" Hour";
            }

            if(duration >= 60){
                const durationInMinutes = duration / 60;
                return durationInMinutes+" Minutes";
            }

            //ceil the durationinDays to neearest
            return duration+" Seconds";

            //APY = (total rewards / total staked) * (365 / days staked) * 100
        }catch(err){

        }
    }

    const getLockPeriod = async (pid: any) => {
        if (!provider ) return;
        try{
            const web3: any = new Web3(provider);
            const contract = new web3.eth.Contract(STAKING_ABI, Config.STAKING_ADDRESS);
            
            let duration = await contract.methods.getPoolInfo(pid).call();
            duration = duration[6];
            
            if(duration >= 86400){
                const durationInDays = duration / 86400;
                return durationInDays+" Days";
            }

            if(duration >= 3600){
                const durationInHours = duration / 3600;
                return durationInHours+" Hour";
            }

            if(duration >= 60){
                const durationInMinutes = duration / 60;
                return durationInMinutes+" Minutes";
            }

            return "No";

            //APY = (total rewards / total staked) * (365 / days staked) * 100
        }catch(err){

        }
    }


    const walletQuery = () => {
        return `${WALLET_PARAMS}=${router.query[WALLET_PARAMS]}`;
    }

    return {
        web3Account,
        vestingContract,
        shillAllotment,
        amountToClaim,
        claimedToken,
        progress,
        end,
        loading,
        currentStep,
        setCurrentStep,
        claiming,
        walletQuery,
        walletBalance,
        totalStaked,
        totalStakedValue,
        totalRewards,
        shillPrice,
        totalRewardsPercent,
        promoEndsIn,
        totalStakedRatio,
        stakingPeriod,
        stakingEndsIn,
        todaysReward,
        staked,
        shillStakedDollars,
        shillEarned,
        shillReward,
        shillRewardDollars,
        stakeShill,
        getLockPeriod,
        stakingBalance,
        unstakeShill,
        claimRewards,
        lockTime,
        annualPercentageYield,
        //function
        getTotalStaked,
        getApy,
        getEnd,
        getEndTime,
        getPeriod,
        getStaked,
        getEarned,
        getTotalReward,
        getRewardDaily,
        getStarted,
        getFinish,
        getStakingEndsIn,
        getStakingStartsIn,
        getLocked,
        getUserLockEndsIn,
        getRewardDistributed,
        getUserPending
    }
}

export default useAccount;