import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ChatListPage from '../pages/ChatListPage';
import ChatPage from '../pages/ChatPage';
import LoginPage from '../pages/LoginPage';
import SettingsPage from '../pages/SettingsPage';


const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="chats" element={
        <ProtectedRoute>
          <ChatListPage />
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
  );
}

export default RoutesComponent;
