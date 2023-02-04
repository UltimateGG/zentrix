import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './pages/LoginPage';
import { JetDesign } from './Jet';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import ChatsListPage from './pages/ChatListPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import SettingsPage from './pages/SettingsPage';

// Init firebase
import './api/firebase';
import { ChatsContextProvider } from './contexts/ChatsContext';
import ChatPage from './pages/ChatPage';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <JetDesign>
      <HashRouter>
        <AuthContextProvider>
        <ChatsContextProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route path="chats" element={
              <ProtectedRoute>
                <ChatsListPage />
              </ProtectedRoute>
            } />

            <Route path="chats/:chatId" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />

            <Route path="settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
          </Routes>

          <Navbar />
        </ChatsContextProvider>
        </AuthContextProvider>
      </HashRouter>
    </JetDesign>
  </React.StrictMode>
);
