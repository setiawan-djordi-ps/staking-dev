import React, { useEffect, useState } from 'react';
import styles from '../content.module.scss';
import dataContent from '../data.json';
import GradientShader from '../../../components/Shader/gradient';
import Link from 'next/link';
import { AiOutlineRight } from 'react-icons/ai';
import { useRouter } from 'next/router';
import Breadcrumbs from '../breadcrumbs';
import SearchBar from '../search-bar';

const StakingHelpCenter = () => {
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
                            <AiOutlineRight size={20} width={25}/>
                            {item}
                        </li>
                    </Link>
                  ))
                }
              </ul>
            </div>
            <div className={styles["content-text"]}>
              {
                selectedContent === ("Minimum and Maximum Staking Amounts") ?
                  <div>
                    At Project SEED, we believe in offering flexible staking options. With a <span style={{fontWeight:'bolder'}}>minimum staking amount of 1 $SHILL</span>, anyone can start staking. 
                    Additionally, <span style={{fontWeight:'bolder'}}>there are no maximum staking limits</span>, giving participants the freedom to stake as much as they desire.
                  </div> 
                : selectedContent === ("How to Stake") ? 
                   <div>
                      <ol>
                        <li>
                          Select the desired reward pool. Click &apos;View&apos; to proceed.
                          <img src={'/assets/help-center/staking/StakingPools.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                        </li>
                        <li>
                          Before you can start staking, SEED: Staking will verify your ownership of $SHILL. 
                          Click &apos;Approve&apos; to begin the verification process.
                          <img src={'/assets/help-center/staking/Approve-Ownership.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                        </li>
                        <li>
                          A pop-out window will appear from your wallet app, requesting your approval for the transaction. Approve the transaction. This process does not involve any additional costs.
                        </li>
                        <li>
                          Once the ownership verification is complete, you will be taken to the staking details page. Click &apos;Stake Now&apos; to start the staking process.
                          <img src={'/assets/help-center/staking/Stake-Now.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                        </li>
                        <li>
                          Enter the amount of tokens you wish to stake in the provided field. Click &apos;Stake&apos; to proceed.
                          <img src={'/assets/help-center/staking/Stake-SHILL.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                        </li>
                        <li>
                          Another pop-out window will appear from your wallet app, requesting your approval for the transaction. Approve the transaction in your wallet app.
                        </li>
                        <li>
                          Congratulations! Your tokens are now successfully added to the staking pool. 
                          You can monitor the progress of your staking and track your rewards in real-time. 
                          Rewards are accrued in every block, providing you with ongoing benefits.
                          <img src={'/assets/help-center/staking/SHILL-Staking-Page.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                          <i style={{fontWeight:'lighter'}}>
                            Please note that once you stake your tokens, you cannot unstake and claim rewards during the specified lock period.
                          </i>
                          <br/>
                        </li>
                      </ol>
                   </div>
                : selectedContent === ("How to Add More Tokens to the Staking Pool") ? 
                  <div>
                      You can add more tokens even if you have already staked tokens in the staking pool to earn additional rewards. Here&apos;s how:
                      <ol>
                        <li>
                          Select the desired staking pool in which you have already staked tokens.
                        </li>
                        <li>
                          Click the &apos;Stake Now&apos; button to proceed.
                        </li>
                        <li>
                          Enter the amount of tokens you wish to add in the provided field and click &apos;Stake&apos; to proceed.
                          <img src={'/assets/help-center/staking/Stake-More-SHILL.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                        </li>
                        <li>
                          A pop-out window will appear from your wallet app, requesting your approval for the transaction. Confirm the transaction in your wallet app.
                          <br/>
                          <br/>
                          <i style={{fontWeight:'lighter'}}>
                            Please note that the lock period will reset if you are still within your previous staking period. Any unclaimed staking rewards will be automatically accumulated towards the next reward.
                          </i>
                          <br/>
                        </li>
                        <li>
                          Congratulations! You have successfully staked additional tokens to the staking pool.
                        </li>
                      </ol> 
                  </div>
                : selectedContent === ("How to Unstake") ? 
                  <div>
                    <ol>
                        <li>
                          Select the desired pool you want to unstake from, then click &apos;View&apos;.
                        </li>
                        <li>
                          You will be redirected to the staking details page. Click &apos;Unstake&apos; to proceed.
                        </li>
                        <li>
                          A confirmation page will appear. Enter the amount of tokens you wish to unstake and click &apos;Unstake&apos;.
                          <img src={'/assets/help-center/staking/Unstake-SHILL.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                        </li>
                        <li>
                          After that, click &apos;Confirm Unstake&apos; to initiate the unstaking process.
                        </li>
                        <li>
                          Another pop-out window will appear from your wallet app, requesting your approval for the transaction. 
                          Approve the transaction in your wallet app to start the unstaking process.
                        </li>
                        <li>
                          Your unstaked tokens have been successfully deposited back to your wallet. Any unclaimed staking rewards will be automatically claimed.
                        </li>
                      </ol>
                  </div>
                : selectedContent === ("How to Claim Rewards") ? <div>
                    <ol>
                      <li>
                        Click the &apos;View&apos; button on the desired reward pool.
                      </li>
                      <li>
                        Click the ‘Claim Rewards’ button.
                        <img src={'/assets/help-center/staking/Reward-Claim.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                      </li>
                      <li>
                        Approve the transaction on your wallet.
                      </li>
                      <li>
                        The claimed amount should be reflected in your wallet balance.
                      </li>
                    </ol>
                  </div>
                : selectedContent === ("How to Withdraw Staked Tokens When the Staking Period Ends") ?
                  <div>
                    After the staking period ends, no further rewards will be distributed. 
                    You can then safely withdraw your staked tokens back to your wallet by following these steps:
                    <ol>
                      <li>Click the &apos;View&apos; button on the desired reward pool where the staking period has ended.</li>
                      <li>
                        Click the ‘Withdraw Tokens’ button.
                        <img src={'/assets/help-center/staking/Withdraw-Staked-Tokens.jpg'} alt="Connect Wallet" style={{width:'100%'}}/>
                      </li>
                      <li>A confirmation page will appear. Click ‘Withdraw’ to initiate the process.</li>
                      <li>Approve the transaction on your wallet.</li>
                      <li>
                        Your staked tokens have been successfully withdrawn back to your wallet. 
                        If you haven’t claimed the last reward, it will be automatically claimed alongside the withdrawn tokens.
                      </li>
                    </ol>
                  </div>
                : selectedContent === ("Staking Page Overview") ? 
                  <div>
                    The page serves as the main tool on the SEED: Staking platform. 
                    It provides multiple tabs where you can access various information about your staking activities. 
                    Tabs available on the page include:
                    <ul>
                      <li>
                        <span style={{fontWeight:'bolder'}}>In-Progress:</span>
                        This tab displays ongoing staking pools. You can view the details of the available staking pools and any relevant status updates.
                      </li>
                      <li>
                        <span style={{fontWeight:'bolder'}}>Your Stakes:</span> 
                        In this tab, you can view the staking pools in which you have already participated, whether they are still in progress or completed. 
                        You can easily access this tab to collect your rewards and manage your staking activities.
                      </li>
                      <li>
                        <span style={{fontWeight:'bolder'}}>Coming Soon:</span> 
                        Stay informed about upcoming staking opportunities through this tab. It provides updates about new staking pools, rewards, and important dates.
                      </li>
                      <li>
                        <span style={{fontWeight:'bolder'}}>Completed:</span> 
                        Access information about the staking pools that were previously available and have been successfully completed within SEED: Staking through this tab.
                      </li>
                    </ul>
                  </div>
                : selectedContent === ("Staking Rewards and Durations") ? 
                  <div>
                      On SEED: Staking, you can stake your cryptocurrency to earn rewards directly from the reward pool. 
                      By staking $SHILL, you will receive staking rewards provided by the platform, including but not limited to in-game perks and APY as listed on the staking pools. 
                      The amount of rewards you receive is dependent on the proportionate amount of cryptocurrency you stake in the pool.
                      <br/>
                      <br/>
                      <i>APY (Annual Percentage Yield) calculates the potential annual return on your staked tokens, factoring in rewards, duration, and compound interest.</i>
                      <br/>
                      <br/>
                      The more you stake, the greater your potential earnings. 
                      Keep in mind that each staking pool will have different rewards and durations, 
                      which will be determined by the platform. Rewards are paid after every network block confirmation.
                  </div>   
                 : selectedContent === ("Staking Fees and Associated Costs") ? 
                  <div>
                    When it comes to staking on SEED: Staking, the only fees you&apos;ll encounter are the gas fees associated with your transactions. 
                    Gas fees are standard on blockchain networks and are used to incentivize transaction processing.
                    <br/>
                    <br/>
                    <i>
                      Please note that the information provided in this section is subject to change. 
                      Keep in mind that reward rates can fluctuate over time based on the total amount of staked tokens and other factors. 
                      It&apos;s important to do your research and understand the risks before deciding to stake.
                    </i>
                  </div>
                : selectedContent === ("Staking Pools") ? 
                  <div>
                    Explore the various staking pools available on SEED: Staking. 
                    Staking pools offer an opportunity for participants to combine their resources and stake their cryptocurrency collectively. 
                    <br/>
                    <br/>
                    <i>
                      Please note that the list of staking pools may be subject to change and availability. 
                      Make sure to review the details and requirements of each staking pool before making your decision.
                    </i>
                    <br/>
                    <br/>
                      Below, you will find a list of the available staking pools. 
                      Choose the staking pool that aligns with your goals and start maximizing your staking rewards.
                  </div>
                : ''
              }
            </div>
          </div>
        </div>
    </div>
  )
}

export default StakingHelpCenter