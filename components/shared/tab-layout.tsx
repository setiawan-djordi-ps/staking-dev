import React, { MouseEvent, MouseEventHandler, ReactChildren, useState, useEffect } from 'react';
import TabItem from './tab-item';
import styles from './tab-layout.module.scss';
import ToggleSwitch from './toggle-switch';
import SearchInput from '../search/search-input';

interface TabLayoutProps {
    selected?: number;
    children?: React.ReactElement[];
}

function TabLayout({ selected: selectedItem, children }: React.PropsWithChildren<TabLayoutProps>) {
    const [selected, setSelected] = useState(selectedItem ?? 0);
    const [yourStakes, setYourStakes] = useState(false);
    const handleChange = (event) => {
        console.log(event.target.id);
        setSelected(event.target.id);
        setYourStakes(false)
    };

    useEffect(() => {
        // Reset "Your stakes" when switching tabs
        setYourStakes(false);
    }, [selected]);

    return (
        <>
            <div style={{display: 'flex'}}>
                <ul className={styles['inline']}>
                    {children.map((elem: any, index) => {
                        const style = index == selected ? 'selected' : '';
                        return (
                            <li
                                id={String(index)}
                                className={styles[style]}
                                key={index}
                                onClick={handleChange}
                            >
                                {elem.props.title}
                            </li>
                        );
                    })}
                </ul>
            </div>
            {/* <div className={styles["search-container"]}>
                <SearchInput/>
            </div>
            <div className={styles["text-info"]}>
                <p>Staked Assets are currently accruing rewards. Below is a list of available stakings and their progress.</p>
            </div> */}
            <div className={styles['tab']}>
                {children[selected]}
            </div>
        </>
    );
}

export default TabLayout;
