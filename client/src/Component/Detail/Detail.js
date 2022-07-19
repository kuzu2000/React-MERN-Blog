import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { publicRequest, userRequest } from '../../redux/requestMethod';
import './Detail.css';
import Moment from 'moment';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import Home from './../../Pages/Home/Home';
import Avatar from '../Nav/no-avatar.png';

const Detail = () => {
  const user = useSelector((state) => state.user);
  const { currentUser } = user;
  const userId = currentUser?.user._id;
  const userName = currentUser?.user.name;
  const userPhoto = currentUser?.user.photo;
  const [post, setPost] = useState({});
  let { slug } = useParams();
  let navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  let [likes, setLikes] = useState(null);
  const [Comments, setCommentS] = useState([]);
  const [comments, setComments] = useState('');
  const commentsRef = useRef();

  useEffect(() => {
    const getPostDetail = async () => {
      const res = await publicRequest.get(`/posts/${slug}`);
      setPost(res.data);
      setLikes(res.data.favourites?.length);
      setLiked(res.data.favourites?.includes(userId));
      setCommentS(res.data.comments);
    };
    getPostDetail();
  }, [slug, userId]);

  console.log(Comments);

  const handleLike = async () => {
    await userRequest.put(`/posts/addToFavourite/${post._id}`);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  const handleComment = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const res = await userRequest.post(`/posts/${post._id}/comment`, {
      comments: `${userPhoto}: ${userName}: ${comments}`,
    });
    setCommentS((prev) => {
      return [...prev, res.data];
    });
  };

  const enterComment = (e) => {
    if (e.keyCode === 13) {
      handleComment();
      setComments('');
      window.location.reload();
    }
  };

  console.log(comments);

  const handleBack = () => {
    navigate(-1);
  };

  console.log(post);

  return (
    <Home>
      <div className="detail">
        <div className="detailHeader">
          <i onClick={handleBack} className="fa fa-arrow-left back"></i>
          <h2>Post</h2>
        </div>
        <div className="postDetail">
          <Link to={`/user/${post.author?._id}`} className="link">
          <div className="postAuthor">
            <div
              className="avatar"
              style={{
                backgroundImage: `url(${post.author?.photo})`,
              }}
            ></div>
            <div className="author-name">{post.author?.name}</div>
          </div>
              </ Link>

          <div className="postDetailTitle">{post.title}</div>
          <div className="postDetailCategories">
            <div className="postDetailCategory">{post.category}</div>
          </div>
          <div
            className="postDetailPhoto"
            style={{ backgroundImage: `url(${post.photo})` }}
          ></div>
          <div className="postDetailDescription">{post.description}</div>
          <div className="postDetailInfo">
            <div className="postDetailDate">
              {Moment(post.createdAt).format('hh:mm A · MMMM DD, YYYY')}
            </div>
            ·<div className="postDetailOS">{post.operationSystem}</div>
          </div>
          <hr />
          <div className="postDetailInteract">
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
            <div className="postDetailComment">
              <i
                style={{
                  marginRight: '5px',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
                className="fa fa-comment"
              ></i>{' '}
              {post.comments?.length} comments
            </div>
          </div>
          <hr />
          <div className="postDetailcommentBox">
            <input
              onChange={(e) => setComments(e.target.value)}
              name="comments"
              value={comments}
              id="input"
              type="text"
              placeholder="Add a comment..."
              onKeyDown={enterComment}
            />
            <hr />
          </div>
          <div className="postDetailcommentSections">
            {post.comments?.map((comment, i) => (
              <div className="postDetailcommentSection" key={i}>
                <div
                  className="postComment"
                  style={{
                    backgroundImage: `url(${comment.split(': ')[0]})`,
                  }}
                ></div>
                <div className="postCommentAuthor">
                  <div className="postCommentAvatar">
                    {comment.split(': ')[1]}
                  </div>
                  <div className="postCommentName">
                    {comment.split(': ')[2]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Home>
  );
};

export default Detail;
