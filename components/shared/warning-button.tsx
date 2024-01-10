import React from "react";
import styles from "./warning-button.module.scss";

interface WarningButtonProps extends React.HTMLProps<HTMLButtonElement>{
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    children?: React.ReactNode;
    backgroundColor?: string;
    maxWidth?: string;
    minHeight?: string;
    small?: boolean;
}

const WarningButton = (props: WarningButtonProps) => {
    return (
        <button 
            className={styles[props.small? "warning-btn-small": "warning-btn"]}
            style={{
                cursor: props.disabled ? "not-allowed" : "pointer",
                ...props.style
            }}
            onClick={props.onClick}
            disabled={props.disabled || false}>
            {props.children}
        </button>
    );
};

export default WarningButton;