import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthPage from './pages/AuthPage';
import { JetDesign } from './Jet';
import { HashRouter, Route, Routes } from 'react-router-dom';

// Init firebase
import './firebase';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <JetDesign>
      <HashRouter>

        <Routes>
          <Route path="/" element={<AuthPage />} />
        </Routes>
      </HashRouter>
    </JetDesign>
  </React.StrictMode>
);
