import React from 'react'
import Modal, { ModalType } from '..';
import styles from './coming-soon.module.scss'
import GradientShader from '../../Shader/gradient';

export interface DialogProps {
    show?: boolean;
    onClose?: () => void;
    countdown?: string;
}
  

const ComingSoonDialog = ({ show, onClose, countdown }: DialogProps) => {
  return (
    <Modal type={ModalType.DEFAULT} show={show} onClose={onClose}>
        <div className={styles['container']}>
            <img src={'/ps-logo.png'} />
            <h1>
                Coming Soon!
            </h1>
            <h2>{countdown}</h2>
            <p>SEED: Staking is on the horizon. Stay tuned!</p>
        </div>
    </Modal>
  )
}

export default ComingSoonDialog