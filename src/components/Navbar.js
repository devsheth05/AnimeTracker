// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/anime-list">Anime List</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/anime-search-and-order">Anime Search</Link></li> {/* Add link to AnimeSearchAndOrder page */}
      </ul>
    </nav>
  );
};

export default Navbar;
