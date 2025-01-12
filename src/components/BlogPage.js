// src/components/BlogPage.js
import React, { useState, useEffect } from 'react';

function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  // Load blog posts from localStorage when the component mounts
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      setBlogPosts(JSON.parse(savedPosts)); // Parse and set posts from localStorage
    }
  }, []); // Run this only once when the component mounts

  // Function to add a new blog post to localStorage
  const handleAddPost = () => {
    if (newPost.trim()) {
      const updatedPosts = [...blogPosts, newPost.trim()];
      setBlogPosts(updatedPosts); // Update state with new post
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts)); // Save updated posts to localStorage
      setNewPost(''); // Clear the textarea
    }
  };

  return (
    <div>
      <h1>My Anime Blog</h1>
      <textarea 
        value={newPost} 
        onChange={(e) => setNewPost(e.target.value)} 
        placeholder="Write a new post"
      />
      <button onClick={handleAddPost}>Add Post</button>
      <ul>
        {blogPosts.map((post, index) => (
          <li key={index}>
            <p>{post}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogPage;
