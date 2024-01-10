import React from 'react'
import styles from './select-token.module.scss';
import Image from 'next/image';


const SelectToken = ({token_data}) => {
  return (
    <>
        <div className={styles["content-header"]}>
          <hr className={styles["hr"]}/>
          <p>Token</p>
        </div>
        <div className={styles["content-body"]}>
         
            <ul className={styles["list-style"]}>
              {
                token_data.map((item,index) => (
                  <li key={index} >
                    <div>
                       <Image src={item.image} width={20} height={20} alt="token icon"/>
                    </div>
                    {item.token_name}
                  </li>
                ))
              }
            </ul>
        </div>
    </>
  )
}

export default SelectToken;