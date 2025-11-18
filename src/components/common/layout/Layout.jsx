import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { authService } from '../../../services/authService';

const Layout = ({ children }) => {
  const user = authService.getCurrentUser();
  const employee = JSON.parse(localStorage.getItem('employee') || '{}');

  return (
    <>
      <Header user={user} employee={employee} />
      <Sidebar user={user} employee={employee} />
      <main
        style={{
          marginLeft: '240px',
          marginTop: '56px',
          padding: '24px',
          backgroundColor: '#ecf0f1',
          minHeight: 'calc(100vh - 56px)',
        }}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;