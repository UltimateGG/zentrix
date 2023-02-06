import React from 'react';
import useAuthContext from '../contexts/AuthContext';


const UnauthorizedPage = () => {
  const { user, logout } = useAuthContext();


  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Access Denied</h1>
      <p>You are not allowed to use this app,</p>
      <p>only whitelisted UIDs can access this application!</p>

      <p style={{ marginTop: '1rem' }}>
        {user && user.firebaseUser && user.firebaseUser.email}
        <br />
        <small>Not you? <a onClick={logout} href="#">Sign in with a different account</a></small> {/* eslint-disable-line jsx-a11y/anchor-is-valid */}
      </p>
    </div>
  );
}

export default UnauthorizedPage;
