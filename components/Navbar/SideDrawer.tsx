import React from "react";
import styles from "./SideDrawer.module.scss";
import { CSSTransition } from "react-transition-group";

const SideDrawer = (props) => {
    return (
        <CSSTransition in={props.show} timeout={400} classNames={"slide-in-right"} mountOnEnter unmountOnExit>
            <aside className={styles["side-drawer"]} onClick={props.onClick}>
                {props.children}
            </aside>
        </CSSTransition>
    );
};

export default SideDrawer;
