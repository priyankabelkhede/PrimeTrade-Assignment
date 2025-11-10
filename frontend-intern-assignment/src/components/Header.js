import React from "react";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Task Management System</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, {user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
