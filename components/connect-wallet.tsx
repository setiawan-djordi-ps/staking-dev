import React from "react";
import styles from "./connect-wallet.module.scss";
import ActionButton from "./shared/action-button";

const ConnectWallet = (props) => {
    return (
        <div className={styles["connect-wallet-container"]}>
            <ActionButton onClick={props.onMetamaskClick} >
                <img id={styles["button-icon-fox"]} src="/fox-icon.svg" alt="fox-icon" />
                Metamask
            </ActionButton>
        </div>
    );
};

export default ConnectWallet;
