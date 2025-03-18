// src/App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazy load the components
const HomePage = React.lazy(() => import('./components/HomePage'));
const BlogPage = React.lazy(() => import('./components/BlogPage'));
const AnimeSearchAndOrder = React.lazy(() => import('./components/AnimeSearchAndOrder')); // Lazy load AnimeSearchAndOrder
const AnimeInfoPage = React.lazy(() => import('./components/AnimeInfoPage')); // Lazy load AnimeInfoPage


function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/anime-search-and-order" element={<AnimeSearchAndOrder />} /> {/* Add route */}
            <Route path="/anime/:id" element={<AnimeInfoPage />} /> {/* Add AnimeInfoPage route */}
            <Route path="/anime" element={<AnimeInfoPage />} />

          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
