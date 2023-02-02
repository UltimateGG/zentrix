import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { JetDesign } from './Jet';
import { HashRouter, Route, Routes } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <JetDesign>
      <HashRouter>

        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </HashRouter>
    </JetDesign>
  </React.StrictMode>
);
