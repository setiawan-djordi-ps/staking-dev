import React from 'react'
import styles from './background.module.scss';

const PageBackground = () => {
  return (
    <div className={styles["bg-container"]}>
        <picture>
            <source media="(max-width: 600px)" srcSet="/background/bg-mobile.png"/>
            <img src="/background/bg.png" alt="gradient mask" className={styles['bg-image-style']} draggable="false"/>
        </picture>
    </div>
  )
}

export default PageBackground