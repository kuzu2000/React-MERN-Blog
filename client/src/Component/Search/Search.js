import React, { useState, useEffect } from 'react';
import Avatar from '../Nav/no-avatar.png';
import Post from './Post';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { publicRequest } from '../../redux/requestMethod';
import Home from '../../Pages/Home/Home';

export default function Search() {
  const location = useLocation();
  const query = location.search.split('=')[1];
  const user = useSelector((state) => state.user);
  const { currentUser } = user;
  const userId = currentUser?.user._id;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const res = await publicRequest.get(`/posts/search?searchQuery=${query}`);
      setPosts(res.data);
    };
    getPosts();
  }, [query]);
  console.log(posts)

  return (
    <Home setPosts={setPosts}>
      <main>
        <h2>Home</h2>
        <div className="posts">
          {posts.map((post) => {
            return (
              <Post
                post={post}
                setPosts={setPosts}
                Avatar={Avatar}
                myKey={post._id}
                key={post._id}
                userId={userId}
                postId={post._id}
              />
            );
          })}
        </div>
      </main>
    </Home>
  );
}
