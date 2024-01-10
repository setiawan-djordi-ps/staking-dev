import React, { useEffect, useState } from 'react';
import styles from '../content.module.scss';
import dataContent from '../data.json';
import GradientShader from '../../../components/Shader/gradient';
import Link from 'next/link';
import { AiOutlineRight } from 'react-icons/ai';
// import SearchInput from '../../../components/search/search-input';
import { useRouter } from 'next/router';
import Breadcrumbs from '../breadcrumbs';
import SearchBar from '../search-bar';

const HelpCenterIntroduction = () => {
  const router = useRouter();
  const { pathname } = router;

  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const { search } = router.query;
    const searchValue = Array.isArray(search) ? search[0] : search;
    setSelectedContent(decodeURIComponent(searchValue) || '');
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
        <div className={styles["content-container"]}>
          <div className={styles["content"]}>
            <div className={styles["content-list"]}>
              <ul className={styles["list"]}>
                {
                  dataContent[`${pageName}`]?.map((item,index) => (
                    <Link  key={index} href={`${pageName}?search=${encodeURIComponent(item)}`} passHref >
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
                selectedContent === ("Introduction") ?
                  <div>
                    Welcome to SEED: Staking, a platform where you can be a part of a revolutionary ecosystem and unlock the power of blockchain technology to earn rewards. 
                    Before proceeding with staking on SEED: Staking, please carefully read and consent to the
                    <Link href='/legal#staking-agreement'>SEED: Staking Agreement. </Link>  
                  </div> 
                : selectedContent === ("How Does Staking Work on Project SEED?") ? 
                  <div>
                    $SHILL serves as the utility token of Project SEED, offering various utilities including staking. On SEED: Staking, 
                    you have the option to stake or lock your $SHILL to earn staking rewards provided by the platform.
                  </div>
                : selectedContent === ("The Benefits of Staking on Project SEED") ? 
                  <div>
                    On SEED: Staking, staking can be understood as utilizing your cryptocurrencies, specifically $SHILL. 
                    It serves as a fantastic incentive for players to reap benefits with or without participating in the game.
                  </div>
                :  selectedContent === ("Security & Risks") ? 
                  <div>
                    Ensuring the security of your staked assets is of utmost importance to us at Project SEED. For that commitment, 
                    we have implemented a comprehensive set of steps and measures to ensure the security of our staking codes. 
                    While we strive to provide a secure staking platform, 
                    it&apos;s crucial to be aware of the potential risks involved, such as malicious attacks and stringent technical requirements.
                    <br/>
                    <br/>
                    By understanding the risks, you can take appropriate measures to safeguard your assets. We encourage you to carefully assess your risk tolerance, conduct thorough research, 
                    and stay informed about the cryptocurrency industry before participating in staking on SEED: Staking.
                  </div>
                : ''
              }
            </div>
          </div>
        </div>
       </div>
    </div>
  )
}

export default HelpCenterIntroduction