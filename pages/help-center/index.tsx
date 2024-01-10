import React, { useState } from 'react';
import styles from './help-center.module.scss';
import SearchInput from '../../components/search/search-input';
import GradientShader from '../../components/Shader/gradient';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from './search-bar';



const Card = ({image, title}) => (
  <Link key={title}  href={`help-center/table-of-content/?title=${title}`} passHref>
    <div className={styles["card"]}>
      <img src={image} title="Card Images" width={350} height={350} alt="image card" className={styles["card-image"]}/>
      <p>{title}</p>
    </div>
   </Link>
);


const HelpCenter = () => {

  return (
    <div>
        <GradientShader isGradient mask/>
        <div className={styles["header"]}> 
          <div className={styles["wrap"]}>
            <h1>Help Center</h1>
            <SearchBar/>
          </div>
        </div>
        <div className={styles["content"]}>
          <div>
            <Card image={'/assets/help-center/introduction.png'} title="introduction"/>
            <Card image={'/assets/help-center/getting-started.png'} title="getting-started"/>
            <Card image={'/assets/help-center/swap.png'} title="swap"/>
            <Card image={'/assets/help-center/staking.png'} title="staking"/>
          </div>
        </div>
    </div>
  );
}

export default HelpCenter;