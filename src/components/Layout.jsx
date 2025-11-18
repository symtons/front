import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { authService } from '../services/authService';

const Layout = ({ children }) => {
  const user = authService.getCurrentUser();
  const employee = JSON.parse(localStorage.getItem('employee') || '{}');

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', margin: 0, padding: 0 }}>
      <Header user={user} employee={employee} />
      <Sidebar user={user} employee={employee} />
      
      <main
        style={{
          flexGrow: 1,
          marginLeft: '240px',
          marginTop: '64px',
          padding: '0px',
          backgroundColor: '#ecf0f1',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          boxSizing: 'border-box',
          width: 'calc(100% - 240px)',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;