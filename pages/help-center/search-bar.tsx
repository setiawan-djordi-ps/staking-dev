import React, { useState } from 'react'
import SearchInput from '../../components/search/search-input';
import Link from 'next/link';
import styles from './help-center.module.scss';
import { useRouter } from 'next/router';
import data from './data.json';



const questions = [
    "Introduction",
    "How Does Staking Work on Project SEED?",
    "The Benefits of Staking on Project SEED",
    "Security & Risks",
    "SHILL Token",
    "Wallet Requirements",
    "Disconnecting and Switching Wallet",
    "Connecting Your Wallet",
    "Swapping Tokens",
    "How to Swap Other Tokens to SHILL",
    "Minimum and Maximum Staking Amounts",
    "How to Stake",
    "How to Add More Tokens to the Staking Pool",
    "How to Unstake",
    "How to Claim Rewards",
    "How to Withdraw Staked Tokens When the Staking Period Ends",
    "Staking Page Overview",
    "Staking Fees and Associated Costs",
    "Staking Pools"
]
  

const SearchBar = () => {

  const [search, setSearch] = useState(''); 
  const router = useRouter();

  const handleRedirect = (item) => {
    return Object.entries(data).forEach(([key, items]) => {
        if (items.includes(item)) {
            return router.push(`/help-center/${key}?search=${encodeURIComponent(item)}`);
        }
    });
  }
  
  return (
    <div style={{position:'relative'}}>  
        <SearchInput value={search} onChange={setSearch}/>
        <div className={styles["search-dropdown-style"]}>
            <ul>
                {
                    search ? questions.filter((value) => {
                        if (value.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())) {
                            return value
                        }
                    }).map((item: any, index: number) => (
                        <li key={index} onClick={() => {handleRedirect(item)}}>
                            <span>
                                {item}
                            </span>
                        </li>
                    ))
                    : ""
                }
            </ul>
        </div>
    </div>
  )
  
}

export default SearchBar