import React from "react";
import styles from "./claim-box.module.scss";
import CustomButton from "./shared/custom-button";

const ClaimBox = (props) => {
    return (
        <div className={styles["claim-box-container"]}>
            <h3>You&apos;re about to claim your Shill token.</h3>
            <p className={styles["claim-amount"]}>
                <img alt="SHILL Logo" src="/SHILL_Logo.svg" />
                {props.amountToClaim}
            </p>
            <p className={styles["confirmation-message"]}>Are you sure you want to claim your Shill token?</p>
            <div className={styles["confirmation-button"]}>
                {props.claiming?(
                    <div className={styles["progress-center"]}>
                        <div className={styles["dot-windmill"]} />
                    </div>
                ): (
                    <>
                        <CustomButton style={{maxWidth: '100%'}} onClick={props.onCancelClick}>Back</CustomButton>
                        <CustomButton style={{marginLeft: 16, maxWidth: '100%'}} backgroundColor="#6bb9a0" onClick={props.onConfirmationClick.bind(this, props.amountToClaim, props.vestingAddr)} disabled={props.claiming}>
                            Claim
                        </CustomButton>
                    </>
                )}        
            </div>
            
        </div>
    );
};

export default ClaimBox;
