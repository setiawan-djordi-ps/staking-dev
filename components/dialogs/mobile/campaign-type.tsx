import React from 'react';
import styles from './campaign-type.module.scss';

interface props{
    listType:string[],
    currentCampaign:number,
    onClickData?:(data:number) => void;
}

const CampaignTypeDialog = ({listType,onClickData , currentCampaign }:props) => {

    const handleClick = (item: number) => {
        onClickData(item); 
    };

    return (
        <div className={styles["container"]} >
            <ul className={styles["body"]}>
                {
                    listType.map((item,index) => (
                        <li key={index} onClick={ () => handleClick(index)} className={`${currentCampaign === index ? styles["current-campaign"] : styles["li-styles"]}`}>
                            {item}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default CampaignTypeDialog