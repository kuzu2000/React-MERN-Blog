import React, { useState, useEffect, useRef } from 'react';
import Logo from './Free_Sample_By_Wix-removebg-preview.png';
import Avatar from './no-avatar.png';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/userSlice';

const Nav = ({ popupActive, setPopupActive }) => {
  const user = useSelector((state) => state.user);
  const { currentUser } = user;
  const [open, setOpen] = useState(false);
  const buttonRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Logout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate('/login');
    setOpen(false);
  };

  

  useEffect(() => {
    const closePopUp = (e) => {
      if (e.path[0] !== buttonRef.current) {
        setOpen(false);
      }
    };

    document.body.addEventListener('click', closePopUp);

    return () => document.body.removeEventListener('click', closePopUp);
  }, []);

  return (
    <nav>
      <div className="fixed-nav">
        <Link to="/" className="link">
          <img src={Logo} alt="Logo" />
        </Link>
        <ul>
          <li>
            <Link to="/" className="link">
              <i className="fa fa-home" style={{ marginRight: '10px' }}></i>{' '}
              Home
            </Link>
          </li>
          <li>
            <Link to="/favourites" className="link">
              <i className="fa fa-star" style={{ marginRight: '10px' }}></i>{' '}
              Favourites
            </Link>
          </li>
          <li>
            <Link to="/settings" className="link">
              <i className="fa fa-cog" style={{ marginRight: '10px' }}></i>{' '}
              Settings
            </Link>
          </li>
          <li>
            <Link to="/profile" className="link">
              <i className="fa fa-user" style={{ marginRight: '10px' }}></i>{' '}
              Profile
            </Link>
          </li>
          <li
            style={{ backgroundColor: 'slateblue', color: 'white' }}
            onClick={() => setPopupActive((prev) => !prev)}
          >
            <i className="fa fa-plus" style={{ marginRight: '10px' }}></i>{' '}
            Create Post
          </li>
          <li
            ref={buttonRef}
            className="logOutPopUp"
            onClick={() => setOpen((prev) => !prev)}
          >
            {currentUser && currentUser?.token ? (
              <>
                <div
                  className="profile"
                  style={{
                    backgroundImage: `url(${
                      currentUser?.user.photo || Avatar
                    })`,
                  }}
                ></div>
                {currentUser?.user.name}
                {open && (
                  <div className="logOutChildren">
                    <div className="logoutProfileDetail">
                      <div
                        className="logoutProfile"
                        style={{
                          backgroundImage: `url(${
                            currentUser?.user.photo || Avatar
                          })`,
                        }}
                      ></div>
                      {currentUser?.user.name}
                    </div>{' '}
                    <div className="logoutButton" onClick={Logout}>
                      <button>LOG OUT</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="link">
                <i className="fa fa-user" style={{ marginRight: '10px' }}></i>{' '}
                Login
              </Link>
            )}
          </li>
        </ul>
        <h3>Subscribe to Newsletter</h3>
        <div className="messageBar">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email Address"
          />
          <i className="fa fa-paper-plane"></i>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
