import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext';


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();


  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  return user ? (<>{children}</>) : null;
}

export default ProtectedRoute;