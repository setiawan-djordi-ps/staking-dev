import React from "react";
import styles from "./connect-wallet.module.scss";
import ActionButton from "./shared/action-button";

const ConnectWalletPhantom = (props) => {
    return (
        <div className={styles["connect-wallet-container"]}>
            <ActionButton onClick={props.onPhantomClick} >
                <img id={styles["button-icon-fox"]} src="/phantom-icon-new.svg" alt="phantom-icon" />
                Phantom
            </ActionButton>
        </div>
    );
};

export default ConnectWalletPhantom;
