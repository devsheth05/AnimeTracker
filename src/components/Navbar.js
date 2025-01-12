// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-around', padding: 0 }}>
        <li><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Home</Link></li>
        <li><Link to="/anime-list" style={{ textDecoration: 'none', color: 'black' }}>Anime List</Link></li>
        <li><Link to="/blog" style={{ textDecoration: 'none', color: 'black' }}>Blog</Link></li>
        <li><Link to="/anime-search-and-order" style={{ textDecoration: 'none', color: 'black' }}>Anime Search</Link></li> {/* Add link to AnimeSearchAndOrder page */}
      </ul>
    </nav>
  );
};

export default Navbar;
