import React, { Fragment } from 'react';
import MenuBar from './MenuBar/MenuBar';

export interface LayoutProps{
    isAuthenticated: boolean;
    isAdmin: boolean;
    children: React.ReactNode
}

const Layout = ({isAuthenticated, isAdmin, children}:LayoutProps)=>{

    return (
        <div style={{height: '100vh'}}>
            <MenuBar isAuthenticated={isAuthenticated}
                     isAdmin={isAdmin} />
            {children}
        </div>
    )
};


export default Layout;