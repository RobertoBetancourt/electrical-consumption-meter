import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './lib/redux_device';
import './index.css';

import Homepage from './auth/Homepage';
import Login from './auth/Login';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path = "/" component = {Login}/>
          <Route exact path = "/homepage" component = {Homepage}/>
        </Switch>
      </Router>
    </Provider>
  );
}
export default App;

