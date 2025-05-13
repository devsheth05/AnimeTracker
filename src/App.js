// src/App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AnimeProvider} from './components/AnimeContext'; // Import the provider

// Lazy load the components
const HomePage = React.lazy(() => import('./components/HomePage'));
const BlogPage = React.lazy(() => import('./components/BlogPage'));
const AnimeSearchAndOrder = React.lazy(() => import('./components/AnimeSearchAndOrder'));
const AnimeInfoPage = React.lazy(() => import('./components/AnimeInfoPage'));

function App() {
  return (
    <AnimeProvider>  {/* Wrap your entire app in the provider */}
      <Router>
        <Navbar />
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/anime-search-and-order" element={<AnimeSearchAndOrder />} />
              <Route path="/anime/:id" element={<AnimeInfoPage />} />
              <Route path="/anime" element={<AnimeInfoPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AnimeProvider>
  );
}

export default App;
