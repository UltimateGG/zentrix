import React from 'react';
import ReactDOM from 'react-dom/client';
import { JetDesign } from './Jet';
import { HashRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import RoutesComponent from './components/Routes';
import Contexts from './contexts/Contexts';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <JetDesign>
      <HashRouter>
        <Contexts>
          <RoutesComponent />

          <Navbar />
        </Contexts>
      </HashRouter>
    </JetDesign>
  </React.StrictMode>
);

// if (process.env.NODE_ENV === 'production')
  // register();
