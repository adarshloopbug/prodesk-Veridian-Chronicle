import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Veridian Chronicle Main Navigation">
      <NavLink to="/" className="nav-logo" aria-label="Veridian Chronicle Home">
        <span style={{ fontSize: '1.8rem', color: '#10b981' }} aria-hidden="true">❖</span>
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
