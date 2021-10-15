import MainMenuItem from "./MainMenuItem/MainMenuItem";
import storeImgSrc from '../../images/magazyn.jpg'
import givingImgSrc from '../../images/wydania.webp'
import ordersImgSrc from '../../images/zamowienia.jpg'

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
                    imgSrc={storeImgSrc}
                    />                    
            <MainMenuItem
                    link="/orders"
                    title="Wydania" 
                    imgSrc={givingImgSrc}
                    />                    
                    
            <MainMenuItem
                    link="/supplies"
                    title="Zamówienia" 
                    imgSrc={ordersImgSrc}
                    />                    
                    
        </div>
    );
}

export default MainMenu;