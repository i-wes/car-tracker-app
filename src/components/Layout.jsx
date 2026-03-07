import React from 'react';
import Navbar from './Navbar';
import Loading from './Loading';
import { Outlet } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';

const Layout = () => {
  const { loadingData } = useExpense();

  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="main-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="glass-panel" style={{ padding: '2rem', minHeight: '80vh' }}>
          {loadingData ? <Loading /> : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default Layout;
