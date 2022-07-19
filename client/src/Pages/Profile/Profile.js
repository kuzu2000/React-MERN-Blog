import React, { useEffect, useState } from 'react';
import './Profile.css';
import Home from '../Home/Home';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userRequest } from '../../redux/requestMethod';
import Post from './Post';
import Avatar from '../../Component/Nav/no-avatar.png';

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state.user);
  const { currentUser } = user;
  const userId = currentUser?.user._id;
  const userName = currentUser?.user.name;
  const userPhoto = currentUser?.user.photo;
  let navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      const res = await userRequest.post('/posts/myUserDetail');
      setPosts(res.data);
    };
    getPosts();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Home>
      <div className="myProfile">
        <div className="header">
            <i onClick={handleBack} className="fa fa-arrow-left back"></i>
          <div className="myProfileDetail">
            <h2>{userName}</h2>
            <p>{posts.length} posts</p>
          </div>
        </div>
        <div className="myProfileInfo">
          <div
            className="myprofilePicture"
            style={{
              backgroundImage: `url(${userPhoto})`,
            }}
          ></div>
          <div className="myProfileName">{userName}</div>
        </div>
        <h3>Posts</h3>
        <div className="posts">
          {posts.map((post) => (
            <Post
              post={post}
              setPosts={setPosts}
              Avatar={Avatar}
              myKey={post._id}
              key={post._id}
              userId={userId}
            />
          ))}
        </div>
      </div>
    </Home>
  );
};

export default Profile;
