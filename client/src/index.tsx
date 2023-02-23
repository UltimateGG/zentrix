import React from 'react';
import ReactDOM from 'react-dom/client';
import { JetDesign } from './Jet';
import SwipableNav from './components/SwipableNav';
import Contexts from './contexts/Contexts';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <JetDesign>
      <Contexts>
        <SwipableNav />
      </Contexts>
    </JetDesign>
  </React.StrictMode>
);

// if (process.env.NODE_ENV === 'production')
  // register();
