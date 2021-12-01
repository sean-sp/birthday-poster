import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import vConsole from 'vconsole';
import './static/scss/common.scss';
import './scripts/rem';

// new vConsole();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);