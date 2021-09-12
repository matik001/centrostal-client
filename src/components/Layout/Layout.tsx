import React, { Fragment } from 'react';
import MenuBar from './MenuBar/MenuBar';

export interface LayoutProps{
    isAuthenticated: boolean;
    isAdmin: boolean;
    children: React.ReactNode
}

const Layout = ({isAuthenticated, isAdmin, children}:LayoutProps)=>{

    return (
        <Fragment>
            <MenuBar isAuthenticated={isAuthenticated}
                     isAdmin={isAdmin} />
            {children}
        </Fragment>
    )
};


export default Layout;