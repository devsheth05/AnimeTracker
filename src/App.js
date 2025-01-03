// src/App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazy load the components
const HomePage = React.lazy(() => import('./components/HomePage'));
const AnimeListPage = React.lazy(() => import('./components/AnimeListPage'));
const BlogPage = React.lazy(() => import('./components/BlogPage'));
const AnimeSearchAndOrder = React.lazy(() => import('./components/AnimeSearchAndOrder')); // Lazy load AnimeSearchAndOrder

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/anime-list" element={<AnimeListPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/anime-search-and-order" element={<AnimeSearchAndOrder />} /> {/* Add route */}
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
