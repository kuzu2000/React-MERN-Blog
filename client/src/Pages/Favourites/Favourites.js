import React, { useState, useEffect } from 'react';
import Avatar from '../../Component/Nav/no-avatar.png';
import Post from './Post';
import { useSelector } from 'react-redux';
import { userRequest } from '../../redux/requestMethod';
import Home from './../Home/Home';
import { useNavigate } from 'react-router-dom';

export default function Favourites() {
  const user = useSelector((state) => state.user);
  const { currentUser } = user;
  const userId = currentUser?.user._id;
  const [posts, setPosts] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    let variables = { userId: userId };
    const getPosts = async () => {
      const res = await userRequest.post('/favourite/getFavourite', variables);
      setPosts(res.data);
    };
    getPosts();
  }, [userId]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Home setPosts={setPosts}>
      <main>
        <div className="detailHeader">
          <i onClick={handleBack} className="fa fa-arrow-left back"></i>
          <h2>Favourites</h2>
        </div>
        <div className="posts">
          {posts.favourites?.map((post) => {
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
