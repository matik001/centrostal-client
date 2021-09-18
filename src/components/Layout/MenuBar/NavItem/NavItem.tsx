import { Nav } from "react-bootstrap";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Location } from "history";

interface NavItemProps{
    link: string;
    text: string;
}

const NavItem = ({link, text}:NavItemProps)=>{
    var location = useLocation<Location>();
    const active = location.pathname === link;
    return (
        <Nav.Link active={active} 
                  as={Link} 
                  to={link}>
            {text}
        </Nav.Link>
    );
}

export default NavItem;