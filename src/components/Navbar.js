// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const navbarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to the left
    border: '1px solid #c3c3c3',
    borderRadius: '4px',
    padding: '10px 20px',
    width: '100%', // Stretch across the screen
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    boxSizing: 'border-box',
  };

  const linksContainerStyle = {
    display: menuVisible ? 'block' : 'none', // Toggle visibility
    marginTop: '10px',
    marginLeft: '20px', // Indent links slightly from the left
    backgroundColor: '#e6f7ff', // Lighter color for open menu
    border: '1px solid #b3d8ff',
    borderRadius: '4px',
    padding: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#007bff', // Blue color for links
    fontSize: '1.2rem', // Increased font size
    display: 'block', // Ensure links stack vertically
    margin: '10px 0', // Increased spacing
  };

  return (
    <div style={{ margin: '10px' }}>
      {/* Navbar label */}
      <div
        style={navbarStyle}
        onClick={() => setMenuVisible(!menuVisible)}
      >
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Navbar</span>
      </div>

      {/* Links */}
      <div style={linksContainerStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/anime-list" style={linkStyle}>Anime List</Link>
        <Link to="/blog" style={linkStyle}>Blog</Link>
        <Link to="/anime-search-and-order" style={linkStyle}>Anime Search</Link>
      </div>
    </div>
  );
};

export default Navbar;
