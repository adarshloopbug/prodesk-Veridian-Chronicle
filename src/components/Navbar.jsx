import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">
        <span style={{ fontSize: '1.8rem', color: '#10b981' }}>❖</span>
        <span>VERIDIAN CHRONICLE</span>
      </NavLink>
      <ul className="nav-links">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Chronicle Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/author/1" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Journalist Hub
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
