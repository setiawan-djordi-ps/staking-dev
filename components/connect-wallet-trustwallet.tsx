import React from "react";
import styles from "./connect-wallet.module.scss";
import ActionButton from "./shared/action-button";

const ConnectWallet = (props) => {
    return (
        <div className={styles["connect-wallet-container"]}>
            <ActionButton onClick={props.onMetamaskClick} >
                <img id={styles["button-icon-fox"]} src="/icon/trust-wallet-icon.svg" alt="trust-wallet-icon" />
                Trust Wallet
            </ActionButton>
        </div>
    );
};

export default ConnectWallet;
