import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { authService } from '../services/authService';

const Layout = ({ children }) => {
  const user = authService.getCurrentUser();
  const employee = JSON.parse(localStorage.getItem('employee') || '{}');

  return (
    <div style={{ display: 'flex', margin: 0, padding: 0 }}>
      <Header user={user} employee={employee} />
      <Sidebar user={user} employee={employee} />
      
      <main
        style={{
          flexGrow: 1,
          marginLeft: '240px',
          padding: '56px 16px 16px 8px',
          backgroundColor: '#ecf0f1',
          minHeight: '100vh',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ margin: 0, padding: 0 }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;