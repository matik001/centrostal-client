import { Link } from "react-router-dom";
import styles from './MainMenuItem.module.css'

export interface MainMenuItemProps{
    link: string;
    title: string;
    imgSrc: string;
}

const MainMenuItem = ({link, title, imgSrc}:MainMenuItemProps)=>{
    return (
        <Link to={link} 
            style={{
                textDecoration: 'none',
                backgroundColor: "black",
                width: "50vh",
                fontSize: 20,
                fontWeight: 'bold',
                color: 'white',
                margin: 'auto',
                textAlign: 'center',
                borderRadius: '25px',
                overflow: 'hidden',
                backgroundSize: '100% 100%',
                backgroundImage: `url('${imgSrc}')` 
        }}>
            <div className={styles.box}>
                {title}
            </div>
        </Link>
    )
}

export default MainMenuItem;