import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { userRequest } from '../../redux/requestMethod';
import { Link } from 'react-router-dom';

const Post = ({ post, userId, myKey, Avatar, setPosts, postId }) => {
  const [liked, setLiked] = useState(post?.postId?.favourites?.includes(userId));
  const [likes, setLikes] = useState(post?.postId?.favourites?.length);
  const [open, setOpen] = useState(false);
  const [favourited, setFavourited] = useState(false);
  const btnRef = useRef();


  

  useEffect(() => {
    let variables = { userId, postId };
    const res = userRequest.post(`/favourite/favourited`, variables)
    if (res.data?.success) {
    setFavourited(res.data?.favourited)
    }
  }, [postId, userId])

  const handleFavourite = () => {
    let variables = { userId, postId };
    if (favourited) {
      const res = userRequest.post(`/favourite/removeFromFavourite`, variables)
      if(res.data?.success) {
        setFavourited(!favourited)
      }
    } else {
      const res = userRequest.post(`/favourite/addToFavourite`, variables)
      if(res.data?.success) {
        setFavourited(!favourited)
      }
    }
  }

  useEffect(() => {
    const closePopUp = (e) => {
      if (e.path[0] !== btnRef.current) {
        setOpen(false);
      }
    };

    document.body.addEventListener('click', closePopUp);

    return () => document.body.removeEventListener('click', closePopUp);
  }, []);

  const handleLike = async () => {
    await userRequest.put(`/posts/addToFavourite/${post.postId?._id}`, userId);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  const deleteTodo = async (id) => {
    await userRequest.delete(`/posts/delete/${id}`);
    setPosts((posts) => posts.filter((post) => post.postId?._id !== id));
  };

  return (
    <div className="post" key={myKey}>
      <div className="postHeader">
        <Link to={`/user/${post.postId?.author?._id}`} className="link">
          <div className="author">
            <div
              className="avatar"
              style={{
                backgroundImage: `url(${post.postId?.author?.photo || Avatar})`,
              }}
            ></div>
            <div className="author-name">{post.postId?.author?.name}</div>
          </div>
        </Link>
        <div
          className="menu"
          ref={btnRef}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className={open ? 'menuLists open' : 'menuLists'}>
            <div className="menuList" onClick={handleFavourite}>{favourited ? 'Unsave' : 'Save'}</div>
            {post.author?._id === userId ? (
              <div className="menuList" onClick={() => deleteTodo(post.postId?._id)}>
                Delete
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      <Link to={`/posts/${post.slug}`} className="link">
        <div className="img" style={{ backgroundImage: `url(${post.postId?.photo})` }}>
          <div className="category">{post.postId?.category}</div>
        </div>
      </Link>
      <Link to={`/posts/${post.slug}`} className="link">
        <div className="header">
          <div className="title">{post?.postId?.title}</div>
          <div className="date">{moment(post.postId?.createdAt).fromNow()}</div>
        </div>
      </Link>
      <div className="description">{post.postId?.description?.substr(0, 100)}...</div>
      <div className="info">
        <div className="info-container">
          <div
            className="like"
            title={liked ? 'Unlike' : 'Like'}
            onClick={handleLike}
          >
            {liked ? (
              <AiFillHeart
                style={{
                  marginRight: '5px',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'rgb(249, 24, 128)',
                }}
              />
            ) : (
              <AiOutlineHeart
                style={{
                  marginRight: '5px',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              />
            )}
            <div className="like-count">{likes} likes</div>
          </div>
          <div className="comments">
            <i
              style={{ marginRight: '5px', fontSize: '24px' }}
              className="fa fa-comments-o"
            ></i>
            {post.postId?.comments?.length} comments
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
