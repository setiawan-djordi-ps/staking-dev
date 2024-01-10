import React, { MouseEvent, MouseEventHandler } from 'react';
import styles from './index.module.scss';

export enum ModalType {
    DEFAULT,
    WARNING,
}

export interface ModalProps {
    children?: React.ReactNode;
    type: ModalType;
    show?: boolean;
    onClose?: MouseEventHandler;
}

function Modal({ children, type, show, onClose }: ModalProps) {

    if (!show) return <></>;
    return (
        <div className={styles['modal']} onClick={onClose}>
            <div className={type == ModalType.WARNING? styles['modal-warning']:  styles['modal-main']}>{children}</div>
        </div>
    );
}

export default Modal;
