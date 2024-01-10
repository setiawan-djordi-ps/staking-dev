import React, { forwardRef, HTMLProps } from 'react'

interface TabItemProps extends HTMLProps<HTMLDivElement> {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    title?: string;
}

const TabItem = ((props: TabItemProps) =>  (
    <div {...props} style={{display:'flex',flexDirection:'column',position:'relative',width:'100%'}}>
        {props.children}
    </div>    
));

export default TabItem;