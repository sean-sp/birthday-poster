import React from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import routes from './routes';

const App = () => {
  return (
    <Router>
      <Switch>
        {routes.map((i, index) => (
          <Route key={index} {...i} />
        ))}
        <Redirect path="/" to={{ pathname: '/' }} />
      </Switch>
    </Router>
  );
};

export default App;
