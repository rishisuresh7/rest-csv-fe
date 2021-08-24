import './App.css';
import React, {useEffect, useState} from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ListItems from './components/list/list-items.component';
import LoginForm from './components/auth/login.component';
import AuthComponent from './components/auth/auth.component';
import SelectComponent from './components/select/select.component';

function App() {
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
      <Switch>
        <Redirect exact from='/' to='/login' />
        <Route
            path = "/login"
            render = { (props) => <LoginForm isLoggedIn={isLoggedIn} setToken={setToken} setIsLoggedIn={setIsLoggedIn} {...props}/>}
        />
        <Route
          path = "/select"
          render = { (props) => <SelectComponent {...props}/> }
        />
        <Route
              exact
              path = "/categories"
              render = {(props) => <AuthComponent {...props} isLoggedIn={isLoggedIn}>
                  <ListItems token={token} />
                </AuthComponent>
              }
        />
      </Switch>
    </div>
  );
}

export default App;
