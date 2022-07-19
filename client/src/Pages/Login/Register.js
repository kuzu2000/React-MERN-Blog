import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../redux/api';
import './Login.css'
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { isFetching, isError, error } = user;
  const handleFocus = (e) => {
    setFocused(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = { name, email, password, passwordConfirm };
    if (password !== passwordConfirm) {
      alert('Password and confirm password are not match');
    } else {
      register(dispatch, form, navigate);
    }
  };

  return (
    <div className="box">
      <h2>Register</h2>
      {isError && <span className="errorBox">{JSON.stringify(error)}</span>}
      <form onSubmit={handleSubmit}>
        <div className="form">
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onBlur={handleFocus}
            onChange={(e) => setName(e.target.value)}
            focused={focused.toString()}
            autoFocus
            required
          />
          <label htmlFor="name">Username</label>
        </div>
        <div className="form">
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onBlur={handleFocus}
            onChange={(e) => setEmail(e.target.value)}
            focused={focused.toString()}
            required
          />
          <label htmlFor="email">Email</label>
        </div>
        <div className="form">
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onBlur={handleFocus}
            onChange={(e) => setPassword(e.target.value)}
            focused={focused.toString()}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className="form">
          <input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            onBlur={handleFocus}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onFocus={() => setFocused(true)}
            focused={focused.toString()}
            required
          />
          <label>Confirm Password</label>
        </div>
        {isFetching ? (
          <button type="submit" disabled={isFetching}>
            <i className="fa fa-spinner fa-spin"></i> Loading
          </button>
        ) : (
          <button type="submit">Register</button>
        )}
        <div style={{ marginTop: '10px' }}>
          Already have an account?{' '}
          <span>
            <Link to="/login">Login</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;
