import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
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


  const dispatch = useDispatchTyped();
  useEffect(()=>{
    dispatch(AuthActions.autoLogin());
  }, [dispatch])

  return (
    <BrowserRouter>
      {isAuthenticated ? <Redirect from="/register" to="/" /> :null}
      {isAuthenticated ? <Redirect from="/login" to="/" /> :null}
      {!isAuthenticated ? <Redirect to="/login" /> :null}
      
      <Layout isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}>
        <Switch>
            <Route path="/items" component={ItemsViewer} />
            <Route path="/orders" component={OrdersManager} />
            {/* <Route path="/quiz/:quizId" component={QuizConducter} />
            <Route path="/register" component={RegisterForm} />  */}
            <Route path="/logout" component={Logout} />
            <Route path="/login" component={LoginForm} /> 
            <Route path="/" exact component={ItemsViewer} /> 
        </Switch>
      </Layout>
    </BrowserRouter>

  );
}

export default App;
