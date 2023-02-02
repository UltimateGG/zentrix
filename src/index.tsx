import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthPage from './pages/AuthPage';
import { JetDesign } from './Jet';
import { HashRouter, Route, Routes } from 'react-router-dom';

// Init firebase
import './firebase';
import { AuthContextProvider } from './contexts/AuthContext';
import ChatsPage from './pages/ChatsPage';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <JetDesign>
      <AuthContextProvider>   
        <HashRouter>

          <Routes>
            <Route path="/" element={<AuthPage />} />

            <Route path="chats" element={<ChatsPage />} />
          </Routes>
        </HashRouter>
      </AuthContextProvider>
    </JetDesign>
  </React.StrictMode>
);
