// src/components/BlogPage.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore
import { collection, addDoc, getDocs } from 'firebase/firestore';

function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  // Load blog posts from Firebase on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "blogPosts"));
      const fetchedPosts = [];
      querySnapshot.forEach((doc) => {
        fetchedPosts.push(doc.data().content);
      });
      setBlogPosts(fetchedPosts);
    };
    fetchPosts();
  }, []);

  // Function to add a new blog post to Firestore
  const handleAddPost = async () => {
    if (newPost.trim()) {
      await addDoc(collection(db, "blogPosts"), { content: newPost.trim() });
      setBlogPosts((prevPosts) => [...prevPosts, newPost.trim()]);
      setNewPost('');
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
