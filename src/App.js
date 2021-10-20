import './App.css';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import LoginForm from './components/auth/login.component';
import AuthComponent from './components/auth/auth.component';
import SelectComponent from './components/select/select.component';
import Header from './components/header/header.component';
import CustomSnackbar from './components/snack-bar/snack-bar.component';
import TabsPage from './pages/tabs-page.component';
import { setSnackWarning } from './components/snack-bar/snack-bar.actions';

function App(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  useEffect(() => {
    const userToken = sessionStorage.getItem('authentication')
    if(userToken && userToken !== '')
    {
        setIsLoggedIn(true);
        setToken(userToken);
    }
  },[])

  return (
    <div className="App">
      <CustomSnackbar />
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} token={token} history={props.history} />
      <Switch>
        <Redirect exact from='/' to='/login' />
        <Route
            path = "/login"
            render = { (props) => <LoginForm isLoggedIn={isLoggedIn} setToken={setToken} setIsLoggedIn={setIsLoggedIn} {...props}/>}
        />
        <Route
              exact
              path = "/prevSelect"
              render = {(props) => <AuthComponent {...props} isLoggedIn={isLoggedIn}>
                  <SelectComponent {...props} token={token}/>
                </AuthComponent>
              }
        />
        <Route
              exact
              path = "/select"
              render = {(props) => <AuthComponent {...props} isLoggedIn={isLoggedIn}>
                  <TabsPage {...props} token={token} />
                </AuthComponent>
              }
        />
      </Switch>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  setSnackWarning: (payload) => dispatch(setSnackWarning(payload)),
})

export default withRouter(connect(null, mapDispatchToProps)(App));
