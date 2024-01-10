import React, { useEffect, useState } from 'react';
import { AiOutlineRight } from "react-icons/ai";
import styles from './legal.module.scss';
import StakingAgreement from './staking-agreement';
import PrivacyPolicy from './privacy-policy';
import MarketPlaceTOS from './terms-of-service/market-place';
// import ProjectSeedTOS from './terms-of-service/projectseed-tos';
import GameTOS from './terms-of-service/game';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSpring, animated  } from '@react-spring/web';
import PageBackground from '../../components/background';


const AnimatedAiOutlineRight = animated(AiOutlineRight);

const data = [
    {
        name:'Staking Agreement',
        content:<StakingAgreement/>,
        link:'staking-agreement'
    },
    {
      name: 'Terms of Service',
      content: '',
      link: 'terms-of-service',
      sub: [
          {
            name: 'ProjectSeed',
            content: <GameTOS/>,
        },
        {
            name: 'Marketplace',
            content: <MarketPlaceTOS/>,
        },
      ],
    },
    {
        name:'Privacy Policy',
        content:<PrivacyPolicy/>,
        link:'privacy-policy'
    }
]


const Legal = () => {
    
    const [selected,setSelected] = useState(null);
    const [selectedSubIndex, setSelectedSubIndex] = useState(0);
    const router = useRouter();
    const routeName = router.asPath.split('#')[1];

    useEffect(() => {
        const selectedRoute = data.find((route) => route.link === routeName);
        window.scrollTo(0, 0);
        setSelected(selectedRoute);
    }, [router,routeName]);

    useEffect(() => {
        if (selected && selected.sub && selected.sub.length > 0) {
            setSelectedSubIndex(0); // Set the first sub-section as the default
        }
      }, [selected]);
    
    const handleSubClick = (subIndex) => {
        setSelectedSubIndex(subIndex);
    };

    const rotate = useSpring({
        from:{ transform: 'rotate(0deg)'},
        to:{ transform: `rotate(${selected && selected.sub && selected.sub.length > 0 ? '90' : '0'}deg)`}
    });


    return (
        <>
            <PageBackground/>
            <div className={styles["container"]}>
                <div className={styles["side-navigation"]}>
                    {
                        data.map((item,index) => (
                            <div key={index} className={ selected?.link === item.link && selected?.sub === undefined ? styles["list-active"] : styles["list"]}>
                                <Link href={`legal/#${item.link}`} passHref>
                                    <div className={styles["list-parent-title"]}>
                                        {item.sub && item.sub.length > 0 ? (<AnimatedAiOutlineRight size={20} style={rotate}/>) : <AiOutlineRight size={20}/>}
                                        <p>{item.name}</p>
                                    </div>
                                </Link>
                                {item.sub && item.sub.length > 0 && (
                                    <div className={selected?.sub !== undefined ? styles['sub-list-active'] : styles['sub-list']}>
                                        {item.sub.map((subItem, subIndex) => (
                                            <div
                                                key={subIndex}
                                                onClick={() => handleSubClick(subIndex)}
                                                className={
                                                    selected?.link === item.link &&
                                                    selectedSubIndex === subIndex
                                                    ? styles['sub-list-item-active']
                                                    : styles['sub-list-item']
                                                }
                                            >
                                            {subItem.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    }
                </div>
                <div className={styles["content"]}>
                    {selected?.sub && selected?.sub.length > 0 ? (
                        selected.sub[selectedSubIndex].content
                    ) : (
                        selected?.content
                    )}
                </div>
            </div>
        </>
    )
}

export default Legal