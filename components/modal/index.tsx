import React, { Children, MouseEventHandler, useState } from 'react'
import { useSpring, animated, useTransition, config } from '@react-spring/web';
import styles from './modal.module.scss';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useMediaQuery } from 'react-responsive';


export interface ModalProps {
    children?: React.ReactNode;
    title?: string;
    isOpen?: boolean;
    onClose?: MouseEventHandler;
    noContentStyle?:boolean,
    borderColor?:string
}


const Modal = ({ isOpen, onClose ,children ,title ,noContentStyle,borderColor} : ModalProps) => {

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const backgroundAnimation = useSpring({
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        config: { ...config.default, duration: isOpen ? 500 : 500 },
    });
      
   const contentAnimation = useSpring({
        transform: isOpen ? 'translateY(0%)' : 'translateY(100%)',
        config: { ...config.default, duration: isOpen ? 500 : 500 },
        delay:100
  });


  // mobile
  const [modalHeight, setModalHeight] = useState(0);

  const modalAnimation = useSpring({
    transform: isOpen ? 'translateY(0%)' : 'translateY(100%)',
    height: isOpen ? `${modalHeight}px` : '0px',
  });

  const handleContentRef = (node) => {
    if (node !== null) {
      setModalHeight(node.getBoundingClientRect().height);
    }
  };
    
  return (
    <>
      {
        isMobile ? (
          <animated.div className={styles["container"]} style={{...backgroundAnimation, pointerEvents: isOpen ? ('auto' as React.CSSProperties['pointerEvents']) : ('none' as React.CSSProperties['pointerEvents'])}}>
              <animated.div className={styles["mobile-modal"]} style={{...modalAnimation, borderColor:`${borderColor}`}}> 
                { 
                  !noContentStyle ?  
                  <div className={styles["mobile-modal-content"]} ref={handleContentRef}>
                    <div className={styles["header"]}>
                      <p>{title}</p>
                      <AiOutlineCloseCircle size={25} className={styles["close-icon"]} onClick={onClose}/>
                    </div>
                    {children}
                    <div style={{padding:'20px'}}></div>
                  </div> :
                  <div ref={handleContentRef}>
                    {children}
                  </div>
                }
            </animated.div>
          </animated.div>
        ) : (
          <animated.div className={styles["container"]} style={{...backgroundAnimation, pointerEvents: isOpen ? ('auto' as React.CSSProperties['pointerEvents']) : ('none' as React.CSSProperties['pointerEvents'])}}>
            <animated.div className={styles["modal-content"]} style={{...contentAnimation, borderColor:`${borderColor}`}}>
              { 
                  noContentStyle ?  
                    <div>
                      {children}
                    </div> 
                    :
                    <div>
                      <div className={styles["header"]}>
                        <p>{title}</p>
                        <AiOutlineCloseCircle size={25} className={styles["close-icon"]} onClick={onClose}/>
                      </div>
                      {children}
                    </div> 
                }
            </animated.div>
        </animated.div>
        )
      }
    </>
  )
}

export default Modal