import React from "react";
import styles from "./action-button.module.scss";

interface ActionButtonProps extends React.HTMLProps<HTMLButtonElement>{
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    children?: React.ReactNode;
    backgroundColor?: string;
    maxWidth?: string;
    minHeight?: string;
    small?: boolean;
}

const ActionButton = (props: ActionButtonProps) => {
    return (
        <button 
            className={styles[props.small? "action-btn-small": "action-btn"]}
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

export default ActionButton;