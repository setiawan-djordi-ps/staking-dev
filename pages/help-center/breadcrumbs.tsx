import Link from 'next/link'
import React from 'react'
import { AiOutlineRight } from 'react-icons/ai'
import styles from './help-center.module.scss';

const Breadcrumbs = ({title,content_title}) => (
    <div className={styles["breadcrumbs"]}>
        <Link href="/help-center" passHref >
            <p> Help Center </p>
        </Link>
       <AiOutlineRight size={20} />
       <Link href={`/help-center/table-of-content?title=${title}`} passHref >
          <p>{title}</p>
       </Link>
       <AiOutlineRight size={20} />
       <p>{content_title}</p>
    </div>
)

export default Breadcrumbs;

