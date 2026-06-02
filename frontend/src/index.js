import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // Imports the global styles we wrote
import App from './App';

// This finds the hidden <div id="root"></div> in your public/index.html file
const root = ReactDOM.createRoot(document.getElementById('root'));

// This injects our Omni-Chat Agent into that div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);