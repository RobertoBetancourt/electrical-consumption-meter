import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './lib/redux_device';
import AuthState from './context/auth/authState';
import tokenAuth from './config/token';
import Homepage from './auth/Homepage';
import Login from './auth/Login';
import './index.css';

//token
const token = localStorage.getItem('token');
if(token) {
  tokenAuth(token);
}

function App() {
  return (
    <AuthState>  
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path = "/" component = {Login}/>
            <Route exact path = "/homepage" component = {Homepage}/>
          </Switch>
        </Router>
      </Provider>
    </AuthState>
  );
}
export default App;

