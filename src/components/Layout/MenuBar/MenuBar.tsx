import { Fragment } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import NavItem from './NavItem/NavItem';

interface MenuBarProps{
    isAuthenticated: boolean;
    isAdmin:boolean;
}

const MenuBar = ({isAuthenticated, isAdmin}:MenuBarProps)=>{
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
            <Container>
                <Navbar.Brand>Menu</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        {isAuthenticated ?
                            <Fragment>
                                <NavItem link="/items" text="Magazyn"/>
                                <NavItem link="/orders" text="Zamówienia"/>
                            </Fragment>
                        : null}
                    </Nav>
                    <Nav>
                        {isAuthenticated ?
                            <NavItem link="/logout" text="Wyloguj"/>
                            :
                            <NavItem link="/login" text="Zaloguj"/>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        // <nav className={style.bar}>
            
        //     <div className={style.row}>
        //         {props.isAuthenticated ?
        //                 props.isTeacher ?(
        //                     <NavItem link="/my_quizzes" >My quizzes</NavItem>
        //                 ) : null
        //             :null}
        //         <NavItem link="/quizzes" >Quizzes</NavItem>
        //         <NavItem link="/about" >About</NavItem>
        //     </div>

        //         <div className={style.row}>
        //             {props.isAuthenticated ?
        //                 <NavItem link="/logout" >Logout</NavItem>
        //                 :
        //                 <Fragment>
        //                     <NavItem link="/login" >Login</NavItem>
        //                     <NavItem link="/register" >Register</NavItem>
        //                 </Fragment>
        //             }
        //         </div>
        // </nav>
    )
}

export default MenuBar;