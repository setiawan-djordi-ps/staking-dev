import Link from 'next/link'
import React from 'react'
import styles from './Navbar.module.scss';

const Footer = () => {
  return (
    <div className={styles["footer-container"]}>
                <div className={styles["footer-disclaimer"]}>
                    <label>Disclaimer :</label>
                    <p>Staking is in BETA. Please stake at your own discretion and understanding of the risks involved.</p>
                </div>
                <div className={styles["footer-links"]}>
                    <Link href="/legal/#staking-agreement" passHref>
                        <a className={styles["footer-link"]}>
                            Staking Agreement
                        </a>
                    </Link>
                    <div/>
                    <Link href="/legal/#terms-of-service" passHref>
                        <a className={styles["footer-link"]}>
                            Terms of Service
                        </a>
                    </Link>
                    <div/>
                    <Link href="/legal/#privacy-policy" passHref>
                        <a className={styles["footer-link"]}>
                            Privacy Policy
                        </a>
                    </Link>
                </div>
                <div className={styles["footer-logo"]}>
                    <img src="/ps-logo.png" alt="Your Logo" width={150} height={150}/>
                </div>
            </div>
  )
}

export default Footer