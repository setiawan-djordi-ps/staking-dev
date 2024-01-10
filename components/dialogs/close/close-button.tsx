import React, { MouseEventHandler } from 'react'
import cstyle from './close-button.module.scss';

interface CloseProps {
    onClick: MouseEventHandler;
    style?: React.CSSProperties;
    warning?: boolean;
}

function CloseButton({ onClick, warning, style }: CloseProps) {

  return (
    <img className={cstyle["close-button"]} src={warning? "/warning_close_delete_icon.svg": "/close_delete_icon.svg"} alt="Close" width={32} height={32} onClick={onClick} style={style} />
  )
}

export default CloseButton;