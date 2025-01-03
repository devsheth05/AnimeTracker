// src/components/BlogPage.js
import React, { useState } from 'react';

function BlogPage() {
  const [post, setPost] = useState('');

  const handlePostChange = (e) => {
    setPost(e.target.value);
  };

  const handlePostSubmit = () => {
    alert('Post submitted!');
    // You can add functionality to save the post to a database or state here.
  };

  return (
    <div>
      <h1>Anime Blog</h1>
      <textarea
        value={post}
        onChange={handlePostChange}
        placeholder="Write your anime-related thoughts here..."
        rows="10"
        cols="50"
      ></textarea>
      <br />
      <button onClick={handlePostSubmit}>Submit Post</button>
    </div>
  );
}

export default BlogPage;
