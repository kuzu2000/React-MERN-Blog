import React, { useState } from 'react';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { publicRequest } from '../../redux/requestMethod';
const Sidebar = ({ categories, popularPosts }) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const searchPostt = async () => {
    if (search.trim()) {
      await publicRequest.get(`/posts/search?searchQuery=${search}`);
      navigate(`/posts/search?searchQuery=${search}`);
    } else {
      navigate('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPostt();
    }
  };

  console.log(search);

  return (
    <aside>
      <div className="sidebar">
        <div className="searchBar">
          <input
            type="search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyPress}
            id=""
            placeholder="Type a keyword and hit enter"
          />
          <i className="fa fa-search"></i>
        </div>
        <div className="categories">
          <h3>Categories</h3>
          <ul>
            {categories.map((category) => (
              <li key={category._id}>
                <p>{category._id}</p>
                <span>({category.numCategory})</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="trending">
          <h3>Popular Articles</h3>
          <div className="articles">
            {popularPosts.map((post) => (
              <div className="article" key={post._id}>
                <div
                  className="articleImg"
                  style={{ backgroundImage: `url(${post.photo})` }}
                ></div>
                <div className="articleInfo">
                  <Link to={`/posts/${post.slug}`} className="link">
                    <div id="title" className="articleTitle">
                      {post.title}
                    </div>
                  </Link>
                  <div className="articleDate">
                    <i
                      className="fa fa-calendar"
                      style={{ marginRight: '5px' }}
                    ></i>
                    {moment(post.createdAt).format('Do MMMM')}
                  </div>
                  <div className="articleAuthor">
                    <div className="articleBy">
                      <i
                        className="fa fa-user"
                        style={{ marginRight: '5px' }}
                      ></i>
                      {post.author?.name}
                    </div>
                    <div className="articleComments">
                      <i
                        className="fa fa-comments"
                        style={{ marginRight: '5px' }}
                      ></i>
                      {post.comment_length}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
