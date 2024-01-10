import React, { useEffect, useState } from 'react';
import styles from '../content.module.scss';
import dataContent from '../data.json';
import GradientShader from '../../../components/Shader/gradient';
import Link from 'next/link';
import { AiOutlineRight } from 'react-icons/ai';
import { useRouter } from 'next/router';
import Breadcrumbs from '../breadcrumbs';
import SearchBar from '../search-bar';


const GettingStarted = () => {
  const router = useRouter();
  const { pathname } = router;

  const [selectedContent, setSelectedContent] = useState(null);
  
  useEffect(() => {
    const { search } = router.query;
    setSelectedContent(search || '');
  }, [router.query]);

  // Extract the string after the last forward slash
  const pageName = pathname.substring(pathname.lastIndexOf('/') + 1);

  return (
    <div>
       <GradientShader isGradient/>
        <div className={styles["container"]}>
          <div className={styles["header-container"]}>
            <div className={styles["header"]}>
              <Breadcrumbs title={pageName} content_title={selectedContent}/>
              <SearchBar/>
            </div>
          </div>
        </div>
        <div className={styles["content-container"]}>
          <div className={styles["content"]}>
            <div className={styles["content-list"]}>
              <ul className={styles["list"]}>
                {
                  dataContent[`${pageName}`]?.map((item,index) => (
                    <Link  key={index} href={`${pageName}?search=${item}`} passHref >
                        <li key={index} onClick={() => {setSelectedContent(item)}}> 
                            <AiOutlineRight size={20} />
                            {item}
                        </li>
                    </Link>
                  ))
                }
              </ul>
            </div>
            <div className={styles["content-text"]}>
              {
                selectedContent === ("SHILL Token") ?
                  <div>
                    At Project SEED, we take pride in our exclusive support for staking our exceptional cryptocurrency: $SHILL. By concentrating on this asset, 
                    we create a dedicated and specialized staking environment within our platform. Here is the list of exchanges where you can get $SHILL:
                    <div>
                      <p style={{fontWeight:'bolder',textDecoration:'underline'}}>Centralized Exchange</p>
                      <ul>
                        <li>
                          <a href='https://trade.kucoin.com/SHILL-USDT' target='_blank' rel="noreferrer">
                            KuCoin
                          </a>
                        </li>
                        <li>
                          <a href='https://www.gate.io/trade/SHILL_USDT' target='_blank' rel="noreferrer">
                            Gate.io
                          </a>
                        </li>
                        <li>
                          <a href='https://www.bybit.com/en-US/trade/spot/SHILL/USDT' target='_blank' rel="noreferrer">
                            Bybit
                          </a>
                        </li>
                        <li>
                          <a href='https://www.mexc.com/exchange/SHILL_USDT' target='_blank' rel="noreferrer">
                            MEXC
                          </a>
                        </li>
                        <li>
                          <a href='https://indodax.com/market/SHILLIDR' target='_blank' rel="noreferrer">
                            Indodax
                          </a>
                        </li>
                      </ul>
                      <p style={{fontWeight:'bolder',textDecoration:'underline'}}>Decentralized Exchange</p>
                      <ul>
                        <li>
                            BNB Chain:
                            <ul>
                              <li>
                                <a href='https://app.apeswap.finance/swap?outputCurrency=0xfb9C339b4BacE4Fe63ccc1dd9a3c3C531441D5fE' target='_blank' rel="noreferrer">
                                  ApeSwap 
                                </a>
                                <span> (BUSD &lt;-&gt; SHILL)</span>
                              </li>
                              {/* <li>
                                <a href='https://dextools.io/app/bsc/pair-explorer/0x77a3b1bba24d8cdc28992dc242f05ded6648a8b3' target='_blank' rel="noreferrer">
                                  DexTools
                                </a>
                                <span> (BUSD &lt;-&gt; SHILL)</span>
                              </li> */}
                              <li>
                                <a href='https://pancakeswap.finance/swap?inputCurrency=0xfb9c339b4bace4fe63ccc1dd9a3c3c531441d5fe' target='_blank' rel="noreferrer">
                                  PancakeSwap
                                </a>
                                <span> (BUSD &lt;-&gt; SHILL)</span>
                              </li>
                            </ul>
                        </li>
                        <li>
                            Solana Blockchain:
                            <ul>
                              <li>
                                <a href='https://jup.ag/swap/USDC-SHILL' target='_blank' rel="noreferrer">
                                  Jupiter
                                </a>
                                <span> (Aggregator Swap) </span>
                              </li>
                              <li>
                                <a href='https://raydium.io/swap/?inputCurrency=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&outputCurrency=6cVgJUqo4nmvQpbgrDZwyfd6RwWw5bfnCamS3M9N1fd&fixed=in' target='_blank' rel="noreferrer">
                                  Raydium Swap
                                </a>
                              </li>
                            </ul>
                        </li>
                      </ul>
                    </div>
                  </div> 
                : selectedContent === ("Wallet Requirements") ? 
                  <div>
                    To stake on SEED: Staking, you will need a compatible wallet. 
                    We support specific wallets for secure management of your staked assets. 
                    By using these wallets, you can easily connect, stake, and earn rewards.
                    <ul>
                      <li>
                        <a href='https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain' target='_blank' rel="noreferrer">
                          Metamask
                        </a>
                        <span> (BSC)</span>
                      </li>
                      <li>
                        <a href='https://trustwallet.com/id/download/' target='_blank' rel="noreferrer">
                          Trust Wallet
                        </a>
                        <span> (BSC)</span>
                      </li>
                      <li>
                        <a href='https://phantom.app/download' target='_blank' rel="noreferrer">
                          Phantom
                        </a>
                        <span> (Solana)</span>
                      </li>
                    </ul>
                  </div>
                : selectedContent === ("Connecting Your Wallet") ? 
                  <div>
                    <ol>
                      <li>
                        Choose your preferred wallet.
                        <img src={'/assets/help-center/getting-started/Wallet-Connect.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                      </li>
                      <li>
                        Your wallet extension in your browser will prompt you to connect the wallet. Confirm to proceed with the wallet connection.
                      </li>
                    </ol>
                </div>
                : selectedContent === ("Disconnecting and Switching Wallet") ? 
                  <div>
                    <ol>
                      <li>
                        Click your connected wallet address at the top right of the page. A drop down menu will show up.
                        <br/>
                        <br/>
                        <img src={'/assets/help-center/getting-started/DisconnectandSwitchingWallet.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                      </li>
                      <li>
                        To change wallet, Select &apos;Change Wallet&apos; to disconnect the current wallet and switch to your desired alternative wallet.
                      </li>
                      <li>
                        Alternatively, you may select &apos;Disconnect Wallet&apos; to disconnect the current wallet.
                      </li>
                    </ol>
                  </div>
                
                : ''
              }
            </div>
          </div>
        </div>
    </div>
  )
}

export default GettingStarted