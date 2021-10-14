import { Fragment } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import MainMenuItem from "./MainMenuItem/MainMenuItem";


const MainMenu = ()=>{
    return (
        <div style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            marginTop: '30px',
            width: '100%'
        }}>
            <MainMenuItem
                    link="/items"
                    title="Stan magazynu"
                    imgSrc='https://www.globalsparesexchange.com/uploads/8/3/4/2/83427492/part-01_orig.jpg'
                    />                    
            <MainMenuItem
                    link="/orders"
                    title="Wydania" 
                    imgSrc='https://yb4ke1guf9g32qn4pnt1k17m-wpengine.netdna-ssl.com/wp-content/uploads/2019/01/Amazon-Warehouse.jpeg.webp'
                    />                    
                    
            <MainMenuItem
                    link="/supplies"
                    title="Zamówienia" 
                    imgSrc='https://cdn.pixabay.com/photo/2018/09/19/11/34/warehouse-3688280_960_720.jpg'
                    />                    
                    
        </div>
    );
}

export default MainMenu;