import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, History, Bell, LogOut, User, CarFront } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="navbar glass-panel">
      <div className="nav-brand">
        <div className="brand-logo-container">
          <CarFront size={28} className="brand-icon" strokeWidth={2.5} />
        </div>
        <span className="brand-name">CarTracker</span>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Pulpit</span>
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Receipt size={20} />
          <span>Dodaj</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <History size={20} />
          <span>Historia</span>
        </NavLink>
        <NavLink to="/reminders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Bell size={20} />
          <span>Przypomnienia</span>
        </NavLink>
      </div>

      <div className="nav-user">
        <div className="user-email">
          <User size={16} />
          <span>{currentUser?.email?.split('@')[0]}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Wyloguj się">
          <LogOut size={18} />
          <span className="logout-text">Wyloguj</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
