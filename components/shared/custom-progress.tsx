import React from 'react'
import styles from "./custom-progress.module.scss";

function ProgressDots() {
  return (
    <div className={styles["progress-center"]}>
        <div className={styles["dots-progress"]} />
    </div>
  )
}

export default ProgressDots;