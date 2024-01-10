import React from "react";
import styles from "./toggle-switch.module.scss";

interface ToggleSwitchProps extends React.HTMLProps<HTMLInputElement> {
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    children?: React.ReactNode;
    backgroundColor?: string;
    maxWidth?: string;
    minHeight?: string;
}

const ToggleSwitch = (props: ToggleSwitchProps) => {
    return (
        <div className={styles["switch"]}>
            <input type="checkbox" id="switch2" className={styles["switch__input"]} />
            <label htmlFor="switch2" className={styles["switch__label"]}></label>
        </div>
    );
};

export default ToggleSwitch;
