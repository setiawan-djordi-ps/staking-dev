import React from 'react'
import styles from './button.module.scss';


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
    <button className={styles["button-style"]} onClick={props.onClick}>
        {props.children}
    </button>
  )
}

export default ActionButton;