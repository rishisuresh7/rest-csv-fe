import './App.css';
import React, {useEffect, useState} from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import LoginForm from './components/auth/login.component';
import AuthComponent from './components/auth/auth.component';
import SelectComponent from './components/select/select.component';
import Header from './components/header/header.component';
import CustomSnackbar from './components/snack-bar/snack-bar.component';

function App(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [notificationItems, setNotificationItems] = useState([]);
  const [snackState, setSnackState] = useState({
    open: false,
    message: '',
    severity: '',
    onClose: () => {
        setSnackState({...snackState, open: false})
    }
});
  useEffect(() => {
    const userToken = sessionStorage.getItem('authentication')
    if(userToken && userToken !== '')
    {
        setIsLoggedIn(true);
        setToken(userToken);
    }
  },[])
  useEffect(() => {
    if(isLoggedIn && token != '') {
      fetch('/api/notifications', {
        headers: {
          Authorization: token,
        }
      })
      .then(resp => resp.status === 200 ? resp.json() : setSnackState({
        ...snackState,
        open: true,
        message: 'Could not fetch notifications',
        severity: 'warning',
      }))
      .then(({success}) => {
        setNotificationItems(success);
      })
    }
  }, [isLoggedIn]);

  return (
    <div className="App">
      <CustomSnackbar />
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} notificationItems={notificationItems} history={props.history} />
      <Switch>
        <Redirect exact from='/' to='/login' />
        <Route
            path = "/login"
            render = { (props) => <LoginForm isLoggedIn={isLoggedIn} setToken={setToken} setIsLoggedIn={setIsLoggedIn} {...props}/>}
        />
        <Route
              exact
              path = "/select"
              render = {(props) => <AuthComponent {...props} isLoggedIn={isLoggedIn}>
                  <SelectComponent {...props} token={token}/>
                </AuthComponent>
              }
        />
      </Switch>
    </div>
  );
}

export default withRouter(App);
