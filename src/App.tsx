import React, { Fragment, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, HashRouter, Redirect, Route, Switch, useLocation,  } from 'react-router-dom';
import { useDispatchTyped, useSelectorTyped } from './store/helperHooks';
import Layout from './components/Layout/Layout';
import LoginForm from './components/LoginForm/LoginForm';
import Logout from './components/Logout/Logout';
import ItemsViewer from './components/ItemsViewer/ItemsViewer';
import OrdersManager from './components/OrdersManager/OrdersManager';
import { AuthActions } from './store/authActions';

function App() {
  const isAuthenticated = useSelectorTyped(state=>state.auth?.token) != null;
  const isAdmin = useSelectorTyped(state=>state.auth?.isAdmin) != null;

  const [didAutologin, setDidAutologin] = useState(false);
  const dispatch = useDispatchTyped();
  useEffect(()=>{
    setDidAutologin(false);
    dispatch(AuthActions.autoLogin());
    setDidAutologin(true);
  }, [dispatch])
  
  return (
    <Fragment>
      
      <Layout isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}>
        <Switch>
            {didAutologin && isAuthenticated ? <Redirect from="/login" to="/" /> :null} 
            <Route path="/login"  component={LoginForm} /> 
            {didAutologin && !isAuthenticated ? <Redirect to="/login" /> :null}
           
            <Route path="/orders" render={()=>
              <OrdersManager isSupply={false} />} />
              
            <Route path="/supplies" render={()=>
              <OrdersManager isSupply={true} />} />

            <Route path="/items" component={ItemsViewer} />
            <Route path="/logout" component={Logout} />
            <Route path="/" exact component={ItemsViewer} /> 
        </Switch>
      </Layout>
    </Fragment>

  );
}

export default App;
