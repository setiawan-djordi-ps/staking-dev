import React from "react";
import styles from "./custom-button.module.scss";

interface CustomButtonProps {
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    children?: React.ReactNode;
    backgroundColor?: string;
    maxWidth?: string;
    minHeight?: string;
}

const CustomButton = (props: CustomButtonProps) => {
    return (
        <button
            className={styles["custom-button"]}
            style={{
                backgroundColor: `${props.backgroundColor || "#49464c"}`,
                maxWidth: `${props.maxWidth || "125px"}`,
                minHeight: `${props.minHeight || "40px"}`,
                cursor: props.disabled ? "not-allowed" : "pointer",
                ...props.style
            }}
            onClick={props.onClick}
            disabled={props.disabled || false}>
            {props.children}
        </button>
    );
};

export default CustomButton;
