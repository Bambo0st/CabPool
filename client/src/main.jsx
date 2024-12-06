import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import tailwind CSS
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import App from './App'; // Import the main App component

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
