import React, { useEffect, useState } from 'react';
import './Profile.css';
import Home from '../Home/Home';
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { userRequest } from '../../redux/requestMethod';
import Post from './Post';
import Avatar from '../../Component/Nav/no-avatar.png';

const OtherProfile = () => {
  const [posts, setPosts] = useState([]);
  const [otherUser, setOtherUser] = useState({})
  const location = useLocation()
  const id = location.pathname.split('/')[2]
  const user = useSelector((state) => state.user);
  const { currentUser } = user;
  const userId = currentUser?.user._id;
  let navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
        const res = await userRequest.get(`/users/${id}`);
        setOtherUser(res.data);
      };
      getUser();
  }, [id])

  useEffect(() => {
    const getPosts = async () => {
      const res = await userRequest.post('/posts/userDetail', {author: id});
      setPosts(res.data);
    };
    getPosts();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };


  return (
    <Home>
      <div className="myProfile">
      <div className="header">
            <i onClick={handleBack} className="fa fa-arrow-left back"></i>
          <div className="myProfileDetail">
            <h2>{otherUser.name}</h2>
            <p>{posts.length} posts</p>
          </div>
        </div>
        <div className="myProfileInfo">
          <div
            className="myprofilePicture"
            style={{
              backgroundImage: `url(${otherUser.photo || Avatar})`,
            }}
          ></div>
          <div className="myProfileName">{otherUser.name}</div>
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

export default OtherProfile;
