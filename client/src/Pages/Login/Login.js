import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../redux/api';
import './Login.css'
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user)
  const {isError, isFetching, error} = user
  const handleFocus = (e) => {
    setFocused(true);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const form = { email, password };
      login(dispatch, form, navigate)
  };


  return (
    <div className="box">
      <h2>Login</h2>
      {isError && <span className="errorBox">{JSON.stringify(error)}</span>}
      <form onSubmit={handleSubmit}>
        <div className="form">
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onBlur={handleFocus}
            onChange={(e) => setEmail(e.target.value)}
            focused={focused.toString()}
            autoFocus
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
        {isFetching ? (<button type="submit" disabled={isFetching}>
        <i className="fa fa-spinner fa-spin"></i>{' '}Loading
        </button>) : (<button type="submit">Login</button>)}
        <div style={{marginTop: "10px"}}>Don't have an account? <span><Link to="/register">Register</Link></span></div>
      </form>
    </div>
  );
};

export default Login;
