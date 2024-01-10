import { useCallback, useEffect, useRef, useState } from 'react';
import getWeb3 from '../getWeb3';
import fs from "fs";
import { useAppContext } from '../context/state';
import { useRouter } from 'next/dist/client/router';
import STAKING_ABI from '../abis/staking_abi.json';
import SHILL_ABI from '../abis/shill/Shill.json';
import Config from '../constants/config';
import TimeUtils from '../utils/timeUtil';
import { sleep } from '../utils/testUtil';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { AnchorProvider,Provider as Prov, Program,web3 ,BN} from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmRawTransaction, sendAndConfirmTransaction, SystemProgram, Commitment} from "@solana/web3.js";
import idl from '../idl/idl.json';
import { StakingPool } from '../idl/type'; 

import axios from 'axios';
import {
    Account,
    createMint,
    getMint,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress
} from "@solana/spl-token";
import { token } from '@project-serum/anchor/dist/cjs/utils';

function useAccountSol() {

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
    const [totalStakeds, setTotalStakeds] = useState<bigint | number>(0);
    const [totalStakedDolar, setTotalStakedDollars] = useState(0);
    const [shillPrice, setShillPrice] = useState<bigint | number>(0);
    const [totalRewards, setTotalRewards] = useState<bigint | number>(0);
    const [totalRewardsPercent, setTotalRewardsPercent] = useState<bigint | number>(0);
    const [totalStakedRatio, setTotalStakedRatio] = useState<Number>(0);
    const [promoEndsIn, setPromoEndsIn] = useState(0);
    const [stakingPeriod, setStakingPeriod] = useState(90);
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
    const [totalDistributedReward, setTotalDistributedReward] = useState(0)
    const [farmer, setFarmer] = useState(true);
    const INTEREST_RATE = 1.11;

    const router = useRouter();
    const WALLET_PARAMS = "wallet";

    useEffect(() => {

        async function fetchShillPrice() {
            console.log("Fetching shill price");
            const url = 'https://api.projectseed.com/v1/currency/prices';
            try {
                const response = await fetch(url);
                const exchange = await response.json();
                console.log("exchange",exchange);
                let prices = exchange.data[0].price;
                console.log("prices",prices);
                setShillPrice(prices);
                //await fetchTotalValue();
            } catch (err) {
                console.log(err);
            }
        }
        
        // fetchStakingPoolData();
        fetchShillPrice();
        // updateStakingEndTime();
      
    }, [ web3Account, provider, web3SolAccount ]);

    async function fetchTotalValue() {
        if (!web3SolAccount) return;

        if(!provider) return;

        try{

            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const response = await axios.get('https://api.projectseed.com/v1/staking/sol');
            const pool = response.data.data;
            let totalValueAll = 0;
            let totalStakedToken = 0;
            let totalRewardAll = 0;
            for(let i = 0; i < pool.length; i++){
                const poolid = pool[i].id;
                const stakingTokenAddr = pool[i].stakingTokenAddr;
                const rewardTokenAddr = pool[i].rewardTokenAddr;
                const stakingTokenName = pool[i].stakingTokenName;
                const rewardTokenName = pool[i].rewardTokenName;
                const rewardTotal = pool[i].rewardAmount;

                const stakeTokenMint = new PublicKey(stakingTokenAddr);
                const rewardTokenMint = new PublicKey(rewardTokenAddr);
                console.log("pool id",poolid)
                const poolId = new PublicKey(poolid);

                const [programStakeAccountAddress, programStakeAccountBump] =
                await PublicKey.findProgramAddressSync(
                    [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                    program.programId
                );
            
                const [programRewardAccountAddress, programRewardAccountBump] =
                await PublicKey.findProgramAddressSync(
                    [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                    program.programId
                );

                const [vaultAccountPda, vaultAccountBump] =
                await anchor.web3.PublicKey.findProgramAddressSync(
                    [
                    Buffer.from("vault"),
                    programStakeAccountAddress.toBuffer(),
                    programRewardAccountAddress.toBuffer(),
                    poolId.toBuffer(),
                    ],
                    program.programId
                );

                const vaultAccount = await program.account.vault.fetch(vaultAccountPda);

                const totalStaked = vaultAccount.totalStaked;

                const totalReward = vaultAccount.totalRewardDisburse;

                const divisor = vaultAccount.precision;

                // Perform the division
                const result = totalStaked.div(divisor);
                const rewardResult = totalReward.div(divisor);
                
                let rewardValue =  parseInt(rewardResult.toString());

                const totalValue = result.toNumber() * parseFloat("0.0102999");
                rewardValue = rewardValue * parseFloat("0.0102999");
                
                console.log("total value",totalValue)
                if(stakingTokenName == "SHILL"){
                    totalValueAll = totalValueAll + totalValue;
                    totalStakedToken = totalStakedToken + result.toNumber();
                }
                if(rewardTokenName == "SHILL"){
                    totalRewardAll = totalRewardAll + rewardValue;
                }
            }
            setTotalStakeds(totalStakedToken)
            setTotalStakedDollars(totalValueAll)
            setTotalDistributedReward(totalRewardAll)
        }catch(err){
            console.log(err)
        }
    }

    const stakeShill = async (amount: number | bigint) => {
        if (!web3Account) return;
        setStakingInProgress(true);
        const pubKey = new PublicKey("6PMZx7iqioT393wVc3ugm4aV5KPvKs8K97zjBGrMmg4v")
        const { SystemProgram, Keypair } = web3
        const ProgramId = new PublicKey(idl.metadata.address)
        // @ts-ignore
        const program = new Program(idl,ProgramId, provider)
        const [stakingPda, stakingPDABump] = await PublicKey.findProgramAddress(
            [Buffer.from('staker'),provider.wallet.publicKey.toBytes()],
            program.programId
        );
      
        // await program.rpc.initStaker({
        //     accounts: {
        //     identity: provider.wallet.publicKey,
        //     staker: stakePda,
        //     payer: provider.wallet.publicKey,
    
        //     // Solana is lost: where are my spl program friends?
        //     systemProgram: SystemProgram.programId,
        //     }
        // });
        // setStakingInProgress(false);

        // For the TRANSFER
        
        const beefMintAddress = new PublicKey("8VMv8KzqosVeEYxmLNwfjy7uNNUL2RRJgR4CXmfDwnnq");
        const seed = beefMintAddress;
        const [beefPDA, beefBagBump] =  await PublicKey.findProgramAddress(
            [seed.toBuffer()],
            program.programId
        );

        const [vaultPda, vaultBump] = await PublicKey.findProgramAddress(
            [Buffer.from('vault'),beefPDA.toBytes()],
            program.programId
        );

        const tokenAccount = await getAssociatedTokenAddress(
            beefMintAddress,
            provider.wallet.publicKey
        )

        // 2. Execute our stuff
            await program.rpc.stake(
                beefBagBump,
                stakingPDABump,
                new BN(parseInt(amount.toString())),
                {
                accounts: {
                    // Solana is lost: where are my spl program friends?
                    tokenProgram: TOKEN_PROGRAM_ID,

                    staker: stakingPda,
                    identity: provider.wallet.publicKey,
                    vault: vaultPda,

                    // **************
                    // TRANSFERING 🐮 FROM USERS
                    // **************
                    userShillAccount: tokenAccount,
                    userShillAccountAuthority: provider.wallet.publicKey,
                    programShillAccount: beefPDA,
                    shillMint: beefMintAddress,
                },
                },
            );

            setStakingInProgress(false);
            const account = await program.account.staker.fetch(stakingPda);
            setStaked(parseInt(account.amount.toString()))
            setStakingBalance(parseInt(account.amount.toString()))
            console.log(parseInt(account.amount.toString()))
    }

    const unstakeShill = async (amount: string) => {
        if (!web3Account) return;
        setStakingInProgress(true);
        const { SystemProgram, Keypair } = web3
        const ProgramId = new PublicKey(idl.metadata.address)
        // @ts-ignore
        const program = new Program(idl,ProgramId, provider)
        const pubKey = new PublicKey("HEHCQSxy1qJLaNNddXP6pN2P2MAQk1wbBiJ6APCqejXA")
        const [stakingPda, stakingPDABump] = await PublicKey.findProgramAddress(
            [Buffer.from('staker'),pubKey.toBytes()],
            program.programId
        );
        const beefMintAddress = new PublicKey("8VMv8KzqosVeEYxmLNwfjy7uNNUL2RRJgR4CXmfDwnnq");
        const seed = beefMintAddress;
        const [beefPDA, beefBagBump] =  await PublicKey.findProgramAddress(
            [seed.toBuffer()],
            program.programId
        );

        const [vaultPda, vaultBump] = await PublicKey.findProgramAddress(
            [Buffer.from('vault'),beefPDA.toBytes()],
            program.programId
        );

        const tokenAccount = await getAssociatedTokenAddress(
            beefMintAddress,
            provider.wallet.publicKey
        )

        console.log("token account",tokenAccount)
        await program.rpc.unstake(
            beefBagBump,
            stakingPDABump,
            new BN(parseInt(amount.toString())),
            {
              accounts: {
                tokenProgram: TOKEN_PROGRAM_ID,
    
                staker: stakingPda,
                identity: pubKey,
                vault: vaultPda,
    
                // **************
                // TRANSFER 🐮 TO USERS
                // **************
                programShillAccount: beefPDA,
                userShillAccount: tokenAccount,
                shillMint: beefMintAddress,
              },
            }
        );
        setStakingInProgress(false); 
        const account = await program.account.staker.fetch(stakingPda);
        setStaked(parseInt(account.amount.toString()))
        setStakingBalance(parseInt(account.amount.toString()))
        console.log(parseInt(account.amount.toString()))       
    }

    const claimRewards = async () => {
        if (!web3Account) return;
        setStakingInProgress(true);
        const { SystemProgram, Keypair } = web3
        const ProgramId = new PublicKey(idl.metadata.address)
        // @ts-ignore
        const program = new Program(idl,ProgramId, provider)
        const pubKey = new PublicKey("HEHCQSxy1qJLaNNddXP6pN2P2MAQk1wbBiJ6APCqejXA")
        const [stakingPda, stakingPDABump] = await PublicKey.findProgramAddress(
            [Buffer.from('staker'),pubKey.toBytes()],
            program.programId
        );
        const beefMintAddress = new PublicKey("8VMv8KzqosVeEYxmLNwfjy7uNNUL2RRJgR4CXmfDwnnq");
        const seed = beefMintAddress;
        const [beefPDA, beefBagBump] =  await PublicKey.findProgramAddress(
            [seed.toBuffer()],
            program.programId
        );

        const [vaultPda, vaultBump] = await PublicKey.findProgramAddress(
            [Buffer.from('vault'),beefPDA.toBytes()],
            program.programId
        );

        const tokenAccount = await getAssociatedTokenAddress(
            beefMintAddress,
            provider.wallet.publicKey
        )

        console.log("token account",tokenAccount)
        await program.rpc.claimReward(
            beefBagBump,
            stakingPDABump,
            {
              accounts: {
                tokenProgram: TOKEN_PROGRAM_ID,
    
                staker: stakingPda,
                identity: pubKey,
                vault: vaultPda,
    
                // **************
                // TRANSFER 🐮 TO USERS
                // **************
                programShillAccount: beefPDA,
                userShillAccount: tokenAccount,
                shillMint: beefMintAddress,
              },
            }
        );
        setStakingInProgress(false); 
        setShillReward(0)
        
        const account = await program.account.staker.fetch(stakingPda);
        setStaked(parseInt(account.amount.toString()))
        setStakingBalance(parseInt(account.amount.toString()))
        console.log(parseInt(account.amount.toString()))        
    }

    const getVaultAccount = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;
        try{
            const ProgramId = new PublicKey(idl.metadata.address);
                // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const poolId = new PublicKey(pool);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);
            return vaultAccount;
        }catch(err){
            console.log(err)
        }
    }

    const getStakingAccount = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;
        try{
            const ProgramId = new PublicKey(idl.metadata.address);
                // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const poolId = new PublicKey(pool);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);
            return vaultAccount;
        }catch(err){
            console.log(err)
        }
    }

    const getStakerAccount = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;
        try{
            const ProgramId = new PublicKey(idl.metadata.address);
                // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const poolId = new PublicKey(pool);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const stakerAccount = await program.account.staker.fetch(stakerAccountPda);

            return stakerAccount;
        }catch(err){
            console.log(err)
        }
    }


    const getVaultInfo = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;
        
        try{
            const vaultAccount = await getVaultAccount(pool,stakingTokenAddr,rewardTokenAddr);
            const totalStakedLamport = vaultAccount.totalStaked;

            const divisor = vaultAccount.precision;

            // Perform the division
            const totalStaked = totalStakedLamport.div(divisor);

            const duration = vaultAccount.duration.toNumber();
            let durationInDays = "";

            if(duration >= 86400){
                const durationResult = duration / 86400;
                durationInDays = durationResult+" Days";
            }

            if(duration >= 3600){
                const durationResult = duration / 3600;
                durationInDays = durationResult+" Hour";
            }

            if(duration >= 60){
                const durationResult = duration / 60;
                durationInDays = durationResult+" Minutes";
            }

            const lockDuration = vaultAccount.lockTime.toNumber();
            let lockDurationInDays = "No";

            if(lockDuration >= 86400){
                const durationInDays = lockDuration / 86400;
                lockDurationInDays = durationInDays+" Days";
            }

            if(lockDuration >= 3600){
                const durationInHours = lockDuration / 3600;
                lockDurationInDays = durationInHours+" Hour";
            }

            if(lockDuration >= 60){
                const durationInMinutes = lockDuration / 60;
                lockDurationInDays = durationInMinutes+" Minutes";
            }


        }catch(err){

        }
    }
    


    const getTotalStaked = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;

        try{
            
            const vaultAccount = await getVaultAccount(pool,stakingTokenAddr,rewardTokenAddr);
            
            //do the calculation in big number
            const totalStaked = vaultAccount.totalStaked;

            const divisor = vaultAccount.precision;

            // Perform the division
            const result = totalStaked.div(divisor);

            return result.toNumber();

        }catch(err){
            console.log(err)
            //call datadoc on error
        }
    }

    const getPeriod = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;

        try{
            const vaultAccount = await getVaultAccount(pool,stakingTokenAddr,rewardTokenAddr);
            
            //do the calculation in big number
            const duration = vaultAccount.duration.toNumber();

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

            return duration+" Seconds";

        }catch(err){
            console.log(err)
            //call datadoc on error
        }
    }

    const getLockPeriod = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;

        try{
            const vaultAccount = await getVaultAccount(pool,stakingTokenAddr,rewardTokenAddr)
            
            //do the calculation in big number
            const duration = vaultAccount.lockTime.toNumber();

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

        }catch(err){
            console.log(err)
            //call datadoc on error
        }
    }

    const getApy = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;

        try{
            const vaultAccount = await getVaultAccount(pool,stakingTokenAddr,rewardTokenAddr);
            
            //do the calculation in big number
            const totalRewards = vaultAccount.rewardAmount
            const totalStaked = vaultAccount.totalStaked;

            const divisor = vaultAccount.precision;

            // Perform the division
            const rewardsInNumber = totalRewards.div(divisor).toNumber();
            const stakedInNumber = totalStaked.div(divisor).toNumber();

            const duration = vaultAccount.duration.toNumber();

            const stakingPeriod = duration / 86400;

            const annualPercentageYield = rewardsInNumber / stakedInNumber * (365 / stakingPeriod) * 100;

            return annualPercentageYield;

        }catch(err){
            console.log(err)
            //call datadoc on error
        }
    }

    const getEnd = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;

        try{
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const poolId = new PublicKey(pool);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);

            const endTime = vaultAccount.endTime.toNumber();

            const timeDiff = endTime - new Date().getTime()/1000

            if(timeDiff < 0){
                return TimeUtils.fromSecondsToDHMS(0);
            }

            return TimeUtils.fromSecondsToDHMS(timeDiff);

        }catch(err){
            console.log(err)
            //call datadoc on error
        }
    }
    

    const getEndTime = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;

        try{
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const poolId = new PublicKey(pool);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);

            const endTime = vaultAccount.endTime.toNumber();

            return endTime;

        }catch(err){
            console.log(err)
            //call datadoc on error
        }
    }

    const getFinish = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;

        try{
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const poolId = new PublicKey(pool);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);

            const endTime = vaultAccount.endTime.toNumber();

            const nowTs = Math.floor(Date.now() / 1000);

            if(nowTs > endTime){
                return true;
            }

            return false;

        }catch(err){
            console.log(err)
            //call datadoc on error
        }
    }

    const getStart = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;

        try{
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const poolId = new PublicKey(pool);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);

            const startTime = vaultAccount.startTime.toNumber();

            const timeDiff = startTime - new Date().getTime()/1000

            if(timeDiff < 0){
                return TimeUtils.fromSecondsToDHMS(0);
            }

            return TimeUtils.fromSecondsToDHMS(timeDiff);

        }catch(err){
            console.log(err)
            //call datadoc on error
        }
    }

    const getStartTime = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;

        try{
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const poolId = new PublicKey(pool);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);

            const endTime = vaultAccount.startTime.toNumber();

            return endTime;

        }catch(err){
            console.log(err)
            //call datadoc on error
        }
    }

    const getStarted = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
        ) => {
        if (!web3Account) return;

        try{
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const poolId = new PublicKey(pool);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);

            const startTime = vaultAccount.startTime.toNumber();

            const nowTs = Math.floor(Date.now() / 1000);

            if(nowTs > startTime){
                return true;
            }

            return false;

        }catch(err){
            console.log(err)
            //call datadoc on error
        }
    }

    const getTokenBalance = async (tokenAddr) => {
        if (!web3Account) return;

        try{
            const tokenMint = new PublicKey(tokenAddr);

            const tokenAccount = await getAssociatedTokenAddressSync(tokenMint, provider.wallet.publicKey);

            const balance = await provider.connection.getTokenAccountBalance(tokenAccount);

            return balance.value.uiAmount
        }catch(err){
            console.log(err)
            //call datadoc on error
            //alert('you didnt own this staking token')

            return 0;
        }
    }

    const getStakerStatus = async (
        pool,
        stakingTokenAddr
        ) => {
        if (!web3Account) return;

        try{
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const poolId = new PublicKey(pool);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
            
            

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );
            const accountInfo = await provider.connection.getAccountInfo(stakerAccountPda)

            return accountInfo !== null;

        }catch(err){
            console.log(err)
            //call datadoc on error
            
        }
    }

    const initStaker = async (
        pool,
        stakingTokenAddr
    ) => {
        if (!web3Account) return;

        try{
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const poolId = new PublicKey(pool);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
            
            

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const stakeTokenAccount = await getAssociatedTokenAddressSync(stakeTokenMint, provider.wallet.publicKey);

            await program.methods.initStaker().accounts({
                staker: stakerAccountPda,
                identity: provider.wallet.publicKey,
                poolId: poolId,
                stakeMint: stakeTokenMint,
                userStakeAccount: stakeTokenAccount,
                systemProgram: SystemProgram.programId,
              }).rpc();
        }catch(err){
            console.log(err)
        }

    }

    const getRewardEarned = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
    ) => {
        if (!web3Account) return;
        setStakingInProgress(true);
        try{    
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const poolId = new PublicKey(pool);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const stakeTokenAccount = await getAssociatedTokenAddress(stakeTokenMint, provider.wallet.publicKey);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const stakerAccount = await program.account.staker.fetch(stakerAccountPda);
            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);

            if(stakerAccount.amount.toNumber() === 0){
                return 0;
            }

            const REWARDS_PRECISION = BigInt(1_000_000);

            let nowTs = BigInt(Math.floor(Date.now() / 1000));

            if(nowTs > BigInt(vaultAccount.endTime.toString())){
                nowTs = BigInt(vaultAccount.endTime.toString());
            }

            const elapsedTime = nowTs - BigInt(vaultAccount.lastRewardTimestamp.toString());
            const rewardsAccrued = BigInt(vaultAccount.rewardPerSecond.toString()) * elapsedTime;

            const newAccRewardPerShare = BigInt(vaultAccount.accRewardPerShare.toString()) + (rewardsAccrued * REWARDS_PRECISION) / BigInt(vaultAccount.totalStaked.toString());

            const rewardsToHarvest = (BigInt(stakerAccount.amount.toString()) * newAccRewardPerShare) / REWARDS_PRECISION;

            const rewardsPaid = BigInt(stakerAccount.rewardDebt.toString());

            const rewardsPending = BigInt(stakerAccount.pendingReward.toString());

            let rewardsEarned = BigInt(0);

            if (rewardsToHarvest >= rewardsPaid) {
                rewardsEarned = rewardsToHarvest + rewardsPending - rewardsPaid;
            }

            // Convert rewardsEarned from lamports to tokens
            const rewardsEarnedInTokens = Number(rewardsEarned) / (10 ** 6);

            return rewardsEarnedInTokens;
        }catch(err){
            console.log(err)
        }
        setStakingInProgress(false);
    }

    const getLocked = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
    ) => {
        if (!web3Account) return;
        setStakingInProgress(true);
        try{    
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const poolId = new PublicKey(pool);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const stakerAccount = await program.account.staker.fetch(stakerAccountPda);

            console.log('locktime', stakerAccount.lockedTime.toNumber());

            const nowTs = Math.floor(Date.now() / 1000);
            
            const locked_Time = stakerAccount.lockedTime.toNumber();
            let locked = true;
            if(nowTs > locked_Time){
                locked = false;
            }

            return locked;
        }catch(err){
            console.log(err)
        }
        setStakingInProgress(false);
    }

    const getLockedTime = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
    ) => {
        if (!web3Account) return;
        setStakingInProgress(true);
        try{    
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const poolId = new PublicKey(pool);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const stakerAccount = await program.account.staker.fetch(stakerAccountPda);

            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);


            const nowTs = Math.floor(Date.now() / 1000);
            
            const finishTime = vaultAccount.endTime.toNumber();
            let locked_Time = stakerAccount.lockedTime.toNumber();
            
            if(finishTime < locked_Time){
                locked_Time = finishTime;
            }

            const timeDiff = locked_Time - nowTs;

            return TimeUtils.fromSecondsToDHMS(timeDiff);
        }catch(err){
            console.log(err)
        }
        setStakingInProgress(false);
    }

    const getRewardClaimed = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
    ) => {
        if (!web3Account) return;
        try{    
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const poolId = new PublicKey(pool);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const stakeTokenAccount = await getAssociatedTokenAddress(stakeTokenMint, provider.wallet.publicKey);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const stakerAccount = await program.account.staker.fetch(stakerAccountPda);
            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);

            // Convert rewardsEarned from lamports to tokens
            const rewardsEarnedInTokens = Number(stakerAccount.earnedRewards) / (10 ** 6);

            return rewardsEarnedInTokens;
        }catch(err){
            console.log(err)
        }
    }

    const getTotalReward = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
    ) => {
        if (!web3Account) return;
        try{    
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const poolId = new PublicKey(pool);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const stakeTokenAccount = await getAssociatedTokenAddress(stakeTokenMint, provider.wallet.publicKey);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);

            // Convert rewardsEarned from lamports to tokens
            const totalRewardsInTokens = Number(vaultAccount.rewardAmount) / parseInt(vaultAccount.precision.toString());

            return totalRewardsInTokens;
        }catch(err){
            console.log(err)
        }
    }

    const getRewardperDay = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
    ) => {
        if (!web3Account) return;
        try{    
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const poolId = new PublicKey(pool);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const stakeTokenAccount = await getAssociatedTokenAddress(stakeTokenMint, provider.wallet.publicKey);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const vaultAccount = await program.account.vault.fetch(vaultAccountPda);

            // Convert rewardsEarned from lamports to tokens

            const rewardPerDay = Number(vaultAccount.rewardPerSecond) / parseInt(vaultAccount.precision.toString()) * 86400;

            return rewardPerDay;
        }catch(err){
            console.log(err)
        }
    }

    const getUserStaked = async (
        pool,
        stakingTokenAddr
    ) => {
        if (!web3Account) return;
        try{    
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            const poolId = new PublicKey(pool);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            // const userTarget = new PublicKey("2yvkG37wbqoCod4W4w1fB1XNovT8wu92p8wHRb9VmtyP")

            const stakeTokenAccount = await getAssociatedTokenAddress(stakeTokenMint, provider.wallet.publicKey);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const stakerAccount = await program.account.staker.fetch(stakerAccountPda);

            // Convert Staked Amount from lamports to tokens
            const StakedInTokens = Number(stakerAccount.amount) / (10 ** 6);

            return StakedInTokens;
        }catch(err){
            console.log(err)
        }
    }




    const doStake = async (
        amount,
        pool,
        stakingTokenAddr,
        rewardTokenAddr
    ) => {
        if (!web3Account) return;
        setStakingInProgress(true);
        try{    
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program: Program<StakingPool> = new Program(idl, ProgramId, provider);

            console.log("amount",amount)

            const amountInLamports = BigInt(amount) * BigInt(10 ** 6);

            console.log("error lamports",amountInLamports)
            console.log("pool", pool)

            const poolId = new PublicKey(pool);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const stakeTokenAccount = await getAssociatedTokenAddress(stakeTokenMint, provider.wallet.publicKey);

            const rewardTokenAccount = await getAssociatedTokenAddress(rewardTokenMint, provider.wallet.publicKey);
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            await program.methods.stake(programStakeAccountBump,programRewardAccountBump,new BN(amountInLamports.toString())).accounts({
                staker: stakerAccountPda,
                identity: provider.wallet.publicKey,
                vault: vaultAccountPda,
                programStakeAccount: programStakeAccountAddress,
                poolId: poolId,
                stakeMint: stakeTokenMint,
                userStakeAccount: stakeTokenAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                programRewardAccount: programRewardAccountAddress,
                rewardMint: rewardTokenMint,
                userRewardAccount: rewardTokenAccount
              }).rpc();

              const stakerAccount = await program.account.staker.fetch(stakerAccountPda);

            console.log("staker account",stakerAccount);
        }catch(err){
            console.log(err)
            throw err;
        }
        setStakingInProgress(false);
    }

    const doUnstake = async (
        amount,
        pool,
        stakingTokenAddr,
        rewardTokenAddr
    ) => {
        if (!web3Account) return;
        setStakingInProgress(true);
        try{    
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program = new Program(idl, ProgramId, provider);

            console.log("amount",amount)

            const amountInLamports = BigInt(amount) * BigInt(10 ** 6);

            console.log("error lamports",amountInLamports)
            console.log("pool", pool)

            const poolId = new PublicKey(pool);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const stakeTokenAccount = await getAssociatedTokenAddress(stakeTokenMint, provider.wallet.publicKey);

            const rewardTokenAccount = await getAssociatedTokenAddress(rewardTokenMint, provider.wallet.publicKey);

            const toTokenAccountInfo = await provider.connection.getAccountInfo(rewardTokenAccount);

            const transaction = new Transaction();

            // Add create token account instruction if source account not created
            if (!toTokenAccountInfo) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        provider.wallet.publicKey,
                        rewardTokenAccount,
                        provider.wallet.publicKey,
                        rewardTokenMint
                    )
                );
                const transactionOpts = {
                    skipPreflight: false,
                    preflightCommitment: 'singleGossip' as Commitment,
                };
                
                // Sign and send the transaction
                const txSignature = await provider.sendAndConfirm(transaction, [], transactionOpts);
            }
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );

            console.log(programStakeAccountAddress)
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            await program.methods.unstake(programStakeAccountBump,programRewardAccountBump ,new anchor.BN(amountInLamports.toString())).accounts({
                staker: stakerAccountPda,
                identity: provider.wallet.publicKey,
                vault: vaultAccountPda,
                programStakeAccount: programStakeAccountAddress,
                poolId: poolId,
                stakeMint: stakeTokenMint,
                userStakeAccount: stakeTokenAccount,
                programRewardAccount: programRewardAccountAddress,
                rewardMint: rewardTokenMint,
                tokenProgram: TOKEN_PROGRAM_ID,
                userRewardAccount: rewardTokenAccount
              }).rpc();

              const stakerAccount = await program.account.staker.fetch(stakerAccountPda);

            console.log("staker account",stakerAccount);
        }catch(err){
            console.log(err)
            throw err;
        }
        setStakingInProgress(false);
    }

    const doClaim = async (
        pool,
        stakingTokenAddr,
        rewardTokenAddr
    ) => {
        if (!web3Account) return;
        setStakingInProgress(true);
        try{    
            const ProgramId = new PublicKey(idl.metadata.address);
            // @ts-ignore
            const program = new Program(idl, ProgramId, provider);

            const poolId = new PublicKey(pool);

            const stakeTokenMint = new PublicKey(stakingTokenAddr);

            const rewardTokenMint = new PublicKey(rewardTokenAddr);

            const rewardTokenAccount = await getAssociatedTokenAddress(rewardTokenMint, provider.wallet.publicKey);

            const toTokenAccountInfo = await provider.connection.getAccountInfo(rewardTokenAccount);

            const transaction = new Transaction();

            // Add create token account instruction if source account not created
            if (!toTokenAccountInfo) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        provider.wallet.publicKey,
                        rewardTokenAccount,
                        provider.wallet.publicKey,
                        rewardTokenMint
                    )
                );
                const transactionOpts = {
                    skipPreflight: false,
                    preflightCommitment: 'singleGossip' as Commitment,
                };
                
                // Sign and send the transaction
                const txSignature = await provider.sendAndConfirm(transaction, [], transactionOpts);
            }

            
        
            const [programStakeAccountAddress, programStakeAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('stake'),stakeTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [programRewardAccountAddress, programRewardAccountBump] =
            await PublicKey.findProgramAddressSync(
                [Buffer.from('reward'),rewardTokenMint.toBuffer(), poolId.toBuffer()],
                program.programId
            );
        
            const [vaultAccountPda, vaultAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("vault"),
                programStakeAccountAddress.toBuffer(),
                programRewardAccountAddress.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            const [stakerAccountPda, stakerAccountBump] =
            await anchor.web3.PublicKey.findProgramAddressSync(
                [
                Buffer.from("staker"),
                provider.wallet.publicKey.toBuffer(),
                stakeTokenMint.toBuffer(),
                poolId.toBuffer(),
                ],
                program.programId
            );

            await program.methods.claimReward(programRewardAccountBump).accounts({
                staker: stakerAccountPda,
                identity: provider.wallet.publicKey,
                vault: vaultAccountPda,
                programRewardAccount: programRewardAccountAddress,
                poolId: poolId,
                rewardMint: rewardTokenMint,
                tokenProgram: TOKEN_PROGRAM_ID,
                userRewardAccount: rewardTokenAccount
            }).rpc();
        }catch(err){
            console.log(err)
            throw err;
        }
        setStakingInProgress(false);
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
        totalStakeds,
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
        totalStakedDolar,
        stakeShill,
        doStake,
        doClaim,
        stakingBalance,
        unstakeShill,
        claimRewards,
        doUnstake,
        initStaker,
        totalDistributedReward,
        lockTime,
        annualPercentageYield,
        getApy,
        getTotalStaked,
        getPeriod,
        getLockPeriod,
        getEnd,
        getStakerStatus,
        getTokenBalance,
        getRewardEarned,
        getRewardClaimed,
        getUserStaked,
        getTotalReward,
        getRewardperDay,
        getEndTime,
        getLocked,
        getLockedTime,
        getFinish,
        getStart,
        getStarted,
        fetchTotalValue
    }
}

export default useAccountSol;