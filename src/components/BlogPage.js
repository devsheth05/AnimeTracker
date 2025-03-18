// src/components/BlogPage.js
import React, { useState, useEffect } from 'react';
import './BlogPage.css'; // Import the new CSS file

function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  // Load blog posts from localStorage when the component mounts
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      setBlogPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Function to add a new blog post
  const handleAddPost = () => {
    if (newPost.trim()) {
      const updatedPosts = [...blogPosts, newPost.trim()];
      setBlogPosts(updatedPosts);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      setNewPost('');
    }
  };

  // Function to delete a post
  const handleDeletePost = (index) => {
    const updatedPosts = blogPosts.filter((_, i) => i !== index);
    setBlogPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  };

  // Function to start editing a post
  const handleEditPost = (index) => {
    setEditingIndex(index);
    setEditText(blogPosts[index]);
  };

  // Function to save the edited post
  const handleSaveEdit = () => {
    const updatedPosts = [...blogPosts];
    updatedPosts[editingIndex] = editText;
    setBlogPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setEditingIndex(null);
    setEditText('');
  };

  return (
    <div className="blog-container">
      <h1>My Anime Blog</h1>
      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Write a new post..."
        className="blog-textarea"
      />
      <button onClick={handleAddPost} className="blog-button">Add Post</button>
      
      <ul className="blog-list">
        {blogPosts.map((post, index) => (
          <li key={index} className="blog-item">
            <span className="user-label">User:</span>
            {editingIndex === index ? (
              <div className="edit-section">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-textarea"
                />
                <button onClick={handleSaveEdit} className="save-button">Save</button>
              </div>
            ) : (
              <>
                <p className="blog-text">{post}</p>
                <div className="blog-actions">
                  <button onClick={() => handleEditPost(index)} className="edit-button">Edit</button>
                  <button onClick={() => handleDeletePost(index)} className="delete-button">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogPage;
