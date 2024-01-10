import React, { useCallback, useState } from 'react'
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai';
import styles from './table-of-content.module.scss';
import GradientShader from '../../../components/Shader/gradient';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SearchInput from '../../../components/search/search-input';
import Image from 'next/image';
import { useSpring, animated  } from '@react-spring/web';

const AnimatedAiOutlineDown = animated(AiOutlineDown);
import dataContent from '../data.json';
import SearchBar from '../search-bar';


const Breadcrumbs = ({title,subTitle,onClick}) => (
    <div className={styles["breadcrumbs"]}>
        <Link href="/help-center" passHref >
            <p> Help Center </p>
        </Link>
       <AiOutlineRight size={20} />
       <p onClick={onClick}>{title}</p>
    </div>
)


const TableOfContent = () => {

    const [subTitle,setSubTitle] = useState('');
    const router = useRouter();
    const { title } = router.query;
    const [openArticles, setOpenArticles] = useState(false);

    const rotate = useSpring({
        from:{ transform: 'rotate(0deg)'},
        to:{ transform: `rotate(${openArticles ? '-180' : '0'}deg)`}
    });

    const dropDownAnim = useSpring({
        height: openArticles ? '130px' : '0px',
        opacity: openArticles ? 1 : 0,
        marginBottom: openArticles ? '20px':'0px',
        reverse: !openArticles
    })

    const handleOpenArticles = useCallback(() => {
        setOpenArticles(!openArticles);
        console.log(openArticles);
    } ,[openArticles]);

    return (
        <>
            <GradientShader isGradient mask/>
            <div className={styles["container"]}>
                <div className={styles["header"]}>
                    <Breadcrumbs title={title} subTitle={subTitle} onClick={() => {setSubTitle('')}}/>
                    <SearchBar/>
                </div>
            </div>
            <div className={styles["body"]}>
                <div className={styles["body-content"]}>
                    <h1>{title}</h1>
                    <ul>
                        {
                            dataContent[`${title}`]?.map((item,index) => (
                                <Link  key={index} href={`${title}?search=${encodeURIComponent(item)}`} passHref>
                                    <li key={index}> 
                                        <AiOutlineRight size={20} />
                                        {item}
                                    </li>
                                </Link>
                            ))
                        }
                    </ul>
                </div>
            </div>
            <div className={styles["images"]}>
                <Image src={`/assets/help-center/${title}.png`} alt={`Help Center ${title} image`} width={500} height={500}/>
            </div>
        </>
    )
}

export default TableOfContent