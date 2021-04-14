import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './lib/redux_device';
import AuthState from './context/auth/authState';
import tokenAuth from './config/token';
import Homepage from './auth/Homepage';
import Login from './auth/Login';
import Register from './auth/Register';
import AlertaState from './context/alertas/alertaState';
import './index.css';

//token
const token = localStorage.getItem('token');
if(token) {
  tokenAuth(token);
}

function App() {
  return (
    <AlertaState>
      <AuthState>  
        <Provider store={store}>
          <Router>
            <Switch>
              <Route exact path = "/" component = {Login}/>
              <Route exact path = "/homepage" render={(props) => (
                <Homepage {...props} user={{id: "1", type: "1"}} />
              )}/>
              <Route exact path = "/register" component = {Register}/>
            </Switch>
          </Router>
        </Provider>
      </AuthState>
    </AlertaState>
  );
}
export default App;

