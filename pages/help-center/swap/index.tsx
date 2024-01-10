import React, { useEffect, useState } from 'react';
import styles from '../content.module.scss';
import dataContent from '../data.json';
import GradientShader from '../../../components/Shader/gradient';
import Link from 'next/link';
import { AiOutlineRight } from 'react-icons/ai';
import { useRouter } from 'next/router';
import Breadcrumbs from '../breadcrumbs';
import SearchBar from '../search-bar';


const SwapHelpCenter = () => {
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
                selectedContent === ("Swapping Tokens") ?
                  <div>
                    If you hold other tokens and wish to exchange them for $SHILL, you can utilize the Swap feature available on this platform. 
                    Below is a list of tokens that you can swap before starting the staking process.
                    <div>
                      <p style={{fontWeight:'bold',textDecoration:'underline'}}>BNB Chain</p>
                      <ul>
                        <li>BNB</li>
                        <li>USDT</li>
                        <li>BUSD</li>
                        <li>$SHILL</li>
                        <li>O2</li>
                      </ul>
                      <p style={{fontWeight:'bold',textDecoration:'underline'}}>Solana Chain</p>
                      <ul>
                        <li>SOLANA</li>
                        <li>USDT</li>
                        <li>USDC</li>
                        <li>$SHILL</li>
                        <li>O2</li>
                      </ul>
                    </div>
                  </div> 
                : selectedContent === ("How to Swap Other Tokens to SHILL") ? 
                  <div>
                    <ol>
                      <li>
                        Connect your wallet to the desired network for the swap.
                      </li>
                      <li>
                        Locate the ‘From’ section and choose the token you want to exchange.
                      </li>
                      <li>
                        In the ‘To’ section, select ‘SHILL’ as the target token.
                      </li>
                      <li>
                        Enter the amount of tokens you wish to swap. The exchange rate will be displayed, showing how many $SHILL tokens you will receive in return.
                        <img src={'/assets/help-center/swap/SwapImage.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                      </li>
                      <li>
                        Click ‘Swap’ to proceed with the transaction.
                      </li>
                      <li>
                        A confirmation page will appear with transaction details. Click ‘Confirm Swap’ to initiate the process.
                        <img src={'/assets/help-center/swap/SwapConfirmTransaction.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                      </li>
                      <li>
                        Approve the transaction confirmation in your wallet to complete the transaction. 
                      </li>
                      <li>
                        Once the transaction is confirmed, SHILL will be deposited into your wallet.
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

export default SwapHelpCenter